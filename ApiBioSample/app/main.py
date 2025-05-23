from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ApiBioSample.app.core.database import create_db_and_tables, SessionDep
from ApiBioSample.app.api.main import api_router
from ApiBioSample.app.core.config import settings
from ApiBioSample.app.models.biosample import BioSample
from ApiBioSample.data.fakedata import generate_fake_data, check_data


@asynccontextmanager
async def lifespan(app: FastAPI):
    generate_fake_data()
    check_data()

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
