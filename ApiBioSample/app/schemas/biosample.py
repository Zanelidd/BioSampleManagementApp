from datetime import datetime

from pydantic import BaseModel,ConfigDict
from typing import List


class CommentSchema(BaseModel):
    id: int
    created_at: datetime
    content: str


class BiosampleSchema(BaseModel):
    id: int
    locations: str
    types: str
    date: str
    operators: str
    comments: List[CommentSchema] = []

class PaginatedBiosampleSchema(BaseModel):
    data: List[BiosampleSchema]
    total: int
    page_index: int
    page_size: int
    page_total: int




class FilterType(BaseModel):
    locations: List[str]
    types: List[str]
    operators: List[str]
    
    
class GetSampleType(BaseModel):
    page_index: int
    limit: int
    sort_by :str
    sort_order :str
    filter_type: FilterType

