from datetime import datetime

from pydantic import BaseModel
from typing import List


class CommentSchema(BaseModel):
    id: int
    created_at: datetime
    content: str


class BiosampleSchema(BaseModel):
    id: int
    location: str
    type: str
    date: str
    operator: str
    comments: List[CommentSchema] = []

class PaginatedBiosampleSchema(BaseModel):
    data: List[BiosampleSchema]
    total: int
    page_index: int
    page_size: int
    page_total: int
