from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy import Column, DateTime


class BioSample(SQLModel, table=True):
    __tablename__ = "biosample"

    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(
        sa_column=Column(DateTime, default=func.now(), nullable=False)
    )
    updated_at: datetime = Field(
        sa_column=Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    )
    locations: str
    types: str
    date: str
    operators: str
    comments: list["Comment"] = Relationship(back_populates="biosample")


class Comment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(
        sa_column=Column(DateTime, default=func.now(), nullable=False)
    )
    updated_at: datetime = Field(
        sa_column=Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    )
    content: str
    biosample_id: int = Field(default=None, foreign_key="biosample.id")
    biosample: BioSample | None = Relationship(back_populates="comments")
