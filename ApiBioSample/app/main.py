import os.path
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.main import api_router
from app.core.config import settings
from app.core.database import create_db_and_tables
from data.fakedata import generate_fake_data, check_data


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not os.path.exists("app/database.db"):
        if not check_data():
            create_db_and_tables()
            generate_fake_data()
    yield


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)
