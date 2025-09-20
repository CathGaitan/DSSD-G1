from fastapi import FastAPI
from api.endpoints.projects import router as projects_router
from api.router import router

app = FastAPI(title="App para DSSD")

app.include_router(projects_router, prefix="/proyecto", tags=["Projects"])
