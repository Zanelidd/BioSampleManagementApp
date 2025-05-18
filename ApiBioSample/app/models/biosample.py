from sqlmodel import SQLModel, Field


class BioSample(SQLModel, table=True):
    id: int = Field(primary_key=True)
    location: str
    type: str
    date: str
    operator: str

