from urllib.parse import unquote_plus
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.services.task_service import TaskService
from app.services.ong_service import OngService
from app.repositories.project_repository import ProjectRepository
from app.repositories.ong_repository import OngRepository
from app.schemas.user_schema import UserResponse
from app.schemas.project_schema import ProjectCreate, ProjectResponse


class ProjectService:
    def __init__(self, db: Session):
        self.project_repo = ProjectRepository(db)
        self.task_service = TaskService(db)
        self.ong_repo = OngRepository(db)
        self.ong_service = OngService(db)

    def get_project(self, project_id: int) -> ProjectResponse | None:
        project = self.project_repo.get_by_id(project_id)
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No existe un proyecto con id={project_id}.")
        return project

    def get_projects_not_owned_by_and_active(self, user: UserResponse) -> list[ProjectResponse]:
        user_ong_ids = [ong.id for ong in user.ongs]
        return self.project_repo.get_projects_not_owned_by_and_active(user_ong_ids)

    def get_project_by_name(self, name: str) -> ProjectResponse | None:
        project = self.project_repo.get_project_by_name(name)
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No existe un proyecto con nombre={name}.")
        return project

    def store_projects(self, project_data: ProjectCreate) -> ProjectResponse:
        try:
            self.ong_service.verify_ong_id_exists(project_data.owner_id)
            project_dict = project_data.model_dump(exclude={"tasks"})
            project_dict["owner_id"] = int(project_data.owner_id)
            project = self.project_repo.create(project_dict)
            self.task_service.process_and_save_tasks(project_data.tasks, project.id)
            return project
        except Exception as e:
            self.project_repo.db.rollback()
            raise e

    def get_projects_with_status(self, status: str) -> list[ProjectResponse]:
        return self.project_repo.get_by_status(status)

    def update_status(self, project, new_status: str):
        project.status = new_status
        return self.project_repo.update(project, {"status": new_status})
