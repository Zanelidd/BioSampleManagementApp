from math import floor
from typing import List

from fastapi import APIRouter, HTTPException, Response
from sqlalchemy.orm import joinedload
from sqlalchemy import func
from sqlmodel import select

from ApiBioSample.app.models.biosample import BioSample, Comment
from ApiBioSample.app.core.database import SessionDep
from ApiBioSample.app.schemas.biosample import BiosampleSchema, PaginatedBiosampleSchema

router = APIRouter(
    prefix="/biosamples",
    tags=["biosamples"],
)


@router.get("/", response_model=PaginatedBiosampleSchema)
def read_biosamples(session: SessionDep, page_index: int = 1, limit: int = 10):
    offset = (page_index - 1) * limit
    statement = select(BioSample).offset(offset).limit(limit)
    biosamples = session.exec(statement).all()
    count_statement = select(func.count()).select_from(BioSample)
    total_count = session.execute(count_statement).scalar()
    page_total = 1 + floor(total_count / limit)

    return {
        "data": biosamples,
        "total": total_count,
        "page_index": page_index,
        "page_size": limit,
        "page_total": page_total
    }


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


@router.post("/")
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
