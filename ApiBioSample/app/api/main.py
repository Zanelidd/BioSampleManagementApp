from fastapi import APIRouter

from app.api.routes import biosample

api_router = APIRouter()

api_router.include_router(biosample.router)