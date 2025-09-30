from sqlalchemy.orm import Session
from app.repositories.project_repository import ProjectRepository
from app.repositories.task_repository import TaskRepository
from app.bonita_integration.bonita_client import BonitaClient
from app.schemas.project_schema import ProjectCreate, ProjectResponse
import time


class ProjectService:
    def __init__(self, db: Session):
        self.project_repo = ProjectRepository(db)
        self.task_repo = TaskRepository(db)
        self.process_name = "Proceso de gestion de proyecto"
        self.bonita = BonitaClient()

    def get_project(self, project_id: int) -> ProjectResponse | None:
        return self.project_repo.get_by_id(project_id)

    def create_project(self, project_data: ProjectCreate) -> ProjectResponse:
        try:
            project_dict = project_data.model_dump(exclude={"tasks"})
            project = self.project_repo.create(project_dict)
            tasks_data = self._prepare_tasks_data(project_data.tasks, project.id)
            self.task_repo.create_multiple_tasks(tasks_data)
            # Arranca envio de datos a bonita
            self.bonita.login()
            process_id = self.bonita.get_process_id_by_name(self.process_name)
            case_id = self.bonita.initiate_process(process_id).get("caseId")
            time.sleep(2) # Sino task_data devuelve vacio
            task_id = self.bonita.start_human_tasks(case_id)[0].get("id")
            self.bonita.assign_task(task_id)
            self.bonita.send_form_data(task_id, {
                "project_name": project_data.name,
                "project_description": project_data.description,
                "project_start_date": project_data.start_date.strftime("%Y-%m-%d"),
                "project_owner": project_data.owner,
            })
            time.sleep(1)  # Sino no veo la variable
            print("TEST GUARDA VAR:", self.bonita.get_variable(case_id, "project_start_date_var"))
            return project
        except Exception:
            self.project_repo.db.rollback()
            raise

    def _prepare_tasks_data(self, tasks: list, project_id: int) -> list[dict]:
        tasks_data = []
        for task in tasks:
            task_dict = task.model_dump()
            task_dict["project_id"] = project_id
            tasks_data.append(task_dict)
        return tasks_data
