from sqlmodel import SQLModel, create_engine, Session
from fastapi.params import Depends
from typing import Annotated

from ApiBioSample.app.core.config import settings


engine = create_engine(
    settings.DATABASE_URL,
    echo=True,
    connect_args={"check_same_thread": False})


def get_db():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
