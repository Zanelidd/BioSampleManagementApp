import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "BioSampleManagementApp"
    PROJECT_DESCRIPTION: str = "An Api build with FastAPI and SQLModel"
    DATABASE_URL: str = os.getenv("DATABASE_URL")



settings = Settings()