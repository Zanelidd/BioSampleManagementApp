from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship


class BioSample(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    location: str
    type: str
    date: str
    operator: str
    comments: list["Comment"] = Relationship(back_populates="biosample")


class Comment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str
    biosample_id: int = Field(default=None, foreign_key="biosample.id")
    biosample: BioSample | None = Relationship(back_populates="comments")
