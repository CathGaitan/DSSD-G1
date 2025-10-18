from sqlalchemy.orm import Session
from app.repositories.project_repository import ProjectRepository
from app.bonita_integration.bonita_client import BonitaClient
from app.schemas.project_schema import ProjectCreate, ProjectResponse
from app.services.task_service import TaskService
import time


class ProjectService:
    def __init__(self, db: Session):
        self.project_repo = ProjectRepository(db)
        self.task_service = TaskService(db)
        self.bonita = BonitaClient()
        self.process_name = "Proceso de gestion de proyecto"

    def get_project(self, project_id: int) -> ProjectResponse | None:
        return self.project_repo.get_by_id(project_id)

    def create_project(self, project_data: ProjectCreate) -> ProjectResponse:
        try:
            project_dict = project_data.model_dump(exclude={"tasks"})
            project = self.project_repo.create(project_dict)

            local_tasks, cloud_tasks = self.task_service.process_tasks(project_data.tasks, project.id, project_data.owner_id)

            # Enviar proyecto a Bonita
            self._send_to_bonita(project_data, cloud_tasks)

            return project
        except Exception:
            self.project_repo.db.rollback()
            raise

    def _send_to_bonita(self, project_data: ProjectCreate, cloud_tasks: list[dict]) -> None:
        """Envía el proyecto y sus tareas a Bonita"""
        self.bonita.login()
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
                "task_resolves_by_itself": task["resolves_by_itself"]
            }
            for task in cloud_tasks
        ]

        self.bonita.send_form_data(task_id, {
            "projectDataInput": {
                "project_name": project_data.name,
                "project_description": project_data.description,
                "project_start_date": project_data.start_date.strftime("%Y-%m-%d"),
                "project_tasks": tasks_bonita
            }
        })
