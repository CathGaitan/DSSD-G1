from fastapi import FastAPI
from app.core.database import Base, engine
from app.api.router import api_router
from fastapi.middleware.cors import CORSMiddleware
from app.models import *

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Projects API")
const port = process.env.PORT || 4000

origins = [
    "http://localhost:5173",  #  frontend vite
    "http://127.0.0.1:5173",  # 127.0.0.1
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
