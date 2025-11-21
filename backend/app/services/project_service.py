from typing import Optional
from urllib.parse import unquote_plus
from sqlalchemy.orm import Session
from app.repositories.project_repository import ProjectRepository
from app.schemas.project_schema import ProjectCreate, ProjectResponse
from app.schemas.user_schema import UserResponse
from app.services.task_service import TaskService
from app.models.project import Project
from app.bonita_integration.bonita_api import bonita
import time


class ProjectService:
    def __init__(self, db: Session):
        self.project_repo = ProjectRepository(db)
        self.task_service = TaskService(db)
        self.bonita = bonita
        self.process_name = "Proceso de gestion de proyecto"

    def get_project(self, project_id: int) -> ProjectResponse | None:
        project = self.project_repo.get_by_id(project_id)
        if not project:
            raise Exception(f"No existe un proyecto con id={project_id}.")
        return project

    def get_projects(self, user: Optional[UserResponse] = None) -> list[ProjectResponse]:
        user_ong_ids = {ong.id for ong in user.ongs}
        if not user_ong_ids:
            return []
        projects = self.project_repo.get_projects_with_tasks_by_owner_ids(list(user_ong_ids))
        return [ProjectResponse.model_validate(p) for p in projects]

    def get_projects_with_status(self, status: str) -> list[ProjectResponse]:
        return self.project_repo.get_by_status(status)

    def get_project_by_name(self, name: str) -> Optional[ProjectResponse]:
        project = self.project_repo.get_project_by_name(name)
        if project:
            return ProjectResponse.model_validate(project)
        return None

    def create_project(self, project_data: ProjectCreate) -> ProjectResponse:
        try:
            project_dict = project_data.model_dump(exclude={"tasks"})
            project = Project(**project_dict)
            self.project_repo.db.add(project)

            self.project_repo.db.flush()
            local_tasks, cloud_tasks = self.task_service.process_tasks(project_data.tasks, project.id, project_data.owner_id)

            if not cloud_tasks:
                project.status = "execution"
            case_id = self._send_to_bonita(project_data, cloud_tasks) 

            project.bonita_case_id = case_id
            self.project_repo.db.commit() 
            self.project_repo.db.refresh(project)

            return project
        except Exception:
            self.project_repo.db.rollback()
            raise

    def _send_to_bonita(self, project_data: ProjectCreate, cloud_tasks: list[dict]) -> str:
        """Envía el proyecto y sus tareas a Bonita"""
        process_id = self.bonita.get_process_id_by_name(self.process_name)
        case_id = self.bonita.initiate_process(process_id).get("caseId")
        time.sleep(1)
        task_id = self.bonita.start_human_tasks(case_id)[0].get("id")
        self.bonita.assign_task(task_id)
        tasks_bonita = [
            {
                "task_title": task["title"],
                "task_necessity": task["necessity"],
                "task_start_date": task["start_date"].strftime("%Y-%m-%d"),
                "task_end_date": task["end_date"].strftime("%Y-%m-%d"),
                "task_resolves_by_itself": task["resolves_by_itself"],
                "task_quantity": task["quantity"],
                "task_status": task["status"]
            }
            for task in cloud_tasks
        ]

        self.bonita.send_form_data(task_id, {
            "projectDataInput": {
                "project_name": project_data.name,
                "project_description": project_data.description,
                "project_start_date": project_data.start_date.strftime("%Y-%m-%d"),
                "project_tasks": tasks_bonita,
                "project_end_date": project_data.end_date.strftime("%Y-%m-%d"),
                "project_status": project_data.status,
                "project_owner_id": project_data.owner_id
            }
        })
        return case_id
