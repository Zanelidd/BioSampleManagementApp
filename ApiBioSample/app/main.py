from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ApiBioSample.app.core.database import create_db_and_tables, SessionDep
from ApiBioSample.app.api.main import api_router
from ApiBioSample.app.core.config import settings
from ApiBioSample.app.models.biosample import BioSample


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield
    biosample_1 = BioSample(location="Paris", type="Water", date="24/05/2025", operator="Dam")
    biosample_2 = BioSample(location="London", type="Chocolate", date="12/03/2025", operator="Dam")
    biosample_3 = BioSample(location="Madrid", type="salt", date="05/05/2025", operator="Dam")
    biosample_4 = BioSample(location="Tokyo", type="pepper", date="today", operator="Dam")

    SessionDep.add(biosample_1)
    SessionDep.add(biosample_2)
    SessionDep.add(biosample_3)
    SessionDep.add(biosample_4)
    SessionDep.commit()



app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)
