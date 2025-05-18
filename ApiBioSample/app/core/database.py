from sqlmodel import SQLModel, create_engine, Session
from ApiBioSample.app.core.config import settings

from ApiBioSample.app.models.biosample import BioSample

engine = create_engine(
    settings.DATABASE_URL,
    echo=True,
    connect_args={"check_same_thread": False})


def get_db():
    with Session(engine) as session:
        yield session


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


BioSample_1 = BioSample(location="Paris", type="Food", date="today", operator="Dam")

with Session(engine) as session:
    session.add(BioSample_1)
    session.commit()
