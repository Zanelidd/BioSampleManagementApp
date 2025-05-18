from pydantic import BaseModel
from typing import List


class CommentSchema(BaseModel):
    id: int
    content: str


class BiosampleSchema(BaseModel):
    location: str
    type: str
    date: str
    operator: str
    comments: List[CommentSchema] = []
