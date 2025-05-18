from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ApiBioSample.app.api.routes import biosample
from ApiBioSample.app.core.config import (settings)
from ApiBioSample.app.core.database import create_db_and_tables

app = FastAPI()

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


@app.on_event("startup")
def on_startup():
    create_db_and_tables()



app.include_router(biosample.router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {"hello": "world"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
