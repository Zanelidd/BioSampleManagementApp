from math import ceil
from typing import List

from fastapi import APIRouter, HTTPException, Response
from sqlalchemy.orm import joinedload
from sqlalchemy.sql.elements import BinaryExpression
from sqlmodel import select, func, distinct, and_

from app.models.biosample import BioSample, Comment
from app.core.database import SessionDep
from app.schemas.biosample import BiosampleSchema, PaginatedBiosampleSchema, GetSampleType

router = APIRouter(
    prefix="/biosamples",
    tags=["biosamples"],
)


@router.post("/", response_model=PaginatedBiosampleSchema)
def read_biosamples(session: SessionDep, datas: GetSampleType, ):
    valid_columns = ["id", "date", "locations", "types", "operators", "created_at", "updated_at"]
    valid_orders = ["asc", "desc"]

    offset = (datas.page_index - 1) * datas.limit

    filters: List[BinaryExpression] = []

    try:
        if datas.filter_type is not None:
            for key, value in datas.filter_type.model_dump().items():
                if value is not None and str(value).strip() != "":
                    column_filtered = getattr(BioSample, key, None)

                    if column_filtered is not None:
                        clause = column_filtered == value
                        if isinstance(clause, BinaryExpression):
                            filters.append(clause)

        if datas.sort_by in valid_columns and datas.sort_order in valid_orders:
            column = getattr(BioSample, datas.sort_by)
            if column is not None:
                order = column.asc() if datas.sort_order == 'asc' else column.desc()

        else:
            order = None

        statement = select(BioSample)
        if order is not None:
            statement = statement.order_by(order)
        if filters:
            statement = statement.where(and_(*filters))

        statement = statement.offset(offset).limit(datas.limit)
        biosamples = session.exec(statement).all()
        count_statement = select(func.count()).select_from(BioSample)
        total_count = session.execute(count_statement).scalar()
        page_total = ceil(total_count / datas.limit)

        return {
            "data": biosamples,
            "total": total_count,
            "page_index": datas.page_index,
            "page_size": datas.limit,
            "page_total": page_total
        }
    except:
        raise HTTPException(status_code=404, detail="Biosample not found")



@router.get("/operators")
def get_list_of_operator(session: SessionDep) -> List[str]:
    statement = select(distinct(BioSample.operators))
    result = session.execute(statement).scalars().all()
    return result


@router.get("/locations")
def get_list_of_operator(session: SessionDep) -> List[str]:
    statement = select(distinct(BioSample.locations))
    result = session.execute(statement).scalars().all()
    return result


@router.get("/types")
def get_list_of_operator(session: SessionDep) -> List[str]:
    statement = select(distinct(BioSample.types))
    result = session.execute(statement).scalars().all()
    return result


@router.get("/{biosample_id}", response_model=BiosampleSchema)
def read_biosample_by_id(biosample_id: int, session: SessionDep):
    biosample_to_get = session.get(BioSample, biosample_id, options=[joinedload(BioSample.comments)])
    if not biosample_to_get:
        raise HTTPException(status_code=404, detail="Biosample not found")

    return biosample_to_get


@router.get("/{biosample_id}/comments", response_model=List[Comment])
def get_biosample_comments(biosample_id: int, session: SessionDep):
    biosample = session.get(BioSample, biosample_id)
    if not biosample:
        raise HTTPException(status_code=404, detail="Biosample not found")

    comments = session.exec(select(Comment).where(Comment.biosample_id == biosample.id)).all()

    return comments


@router.post("/biosample")
def add_biosample(biosample: BioSample, session: SessionDep):
    session.add(biosample)
    session.commit()
    session.refresh(biosample)
    return biosample


@router.post("/{biosample_id}/comments")
def add_biosample_comment(biosample_id: int, comment: str, session: SessionDep):
    biosample = session.get(BioSample, biosample_id)
    if not biosample:
        raise HTTPException(status_code=404, detail="Biosample not found")

    db_comment = Comment(content=comment, biosample_id=biosample_id)
    session.add(db_comment)
    session.commit()
    session.refresh(db_comment)
    return db_comment


@router.put("/{biosample_id}", response_model=BiosampleSchema)
async def update_biosample(biosample_id: int, biosample_to_update: BioSample, session: SessionDep):
    db_biosample = session.get(BioSample, biosample_id)
    if not db_biosample:
        raise HTTPException(status_code=404, detail="Biosample not found")

    data = biosample_to_update.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(db_biosample, key, value)

    session.add(db_biosample)
    session.commit()
    session.refresh(db_biosample)
    return db_biosample


@router.delete("/{biosample_id}")
def delete_biosample(biosample_id: int, session: SessionDep):
    biosample_to_delete = session.get(BioSample, biosample_id)
    if not biosample_to_delete:
        raise HTTPException(status_code=404, detail="Biosample not found")

    comments = session.exec(select(Comment).where(Comment.biosample_id == biosample_id)).all()
    for comment in comments:
        session.delete(comment)

    session.delete(biosample_to_delete)
    session.commit()

    return Response(status_code=204)
