from fastapi import APIRouter
from app.api.endpoints import ongs
from app.api.endpoints import projects
from app.api.endpoints import tasks
from app.api.endpoints import users
from app.api.endpoints import auth
from app.api.endpoints import stats
from app.api.endpoints import observations

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(projects.router, prefix="/api/projects", tags=["projects"])
api_router.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(ongs.router, prefix="/api/ongs", tags=["ongs"])
api_router.include_router(stats.router, prefix="/api/stats", tags=["stats"])
api_router.include_router(observations.router, prefix="/api/observations", tags=["observations"])


@api_router.get("/")
def read_root():
    return {"message": "Hola, soy el backend CLOUD del grupo 01 de DSSD!"}
