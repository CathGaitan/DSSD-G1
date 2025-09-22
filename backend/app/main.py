from fastapi import FastAPI
from app.core.database import Base, engine
from app.api.router import api_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Projects API")

app.include_router(api_router)
