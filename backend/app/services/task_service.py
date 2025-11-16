from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories.task_repository import TaskRepository
from app.schemas.task_schema import TaskCreate
from app.services.ong_service import OngService
from app.bonita_integration.bonita_api import bonita
import time


class TaskService:
    def __init__(self, db: Session):
        self.task_repo = TaskRepository(db)
        self.ong_service = OngService(db)
        self.process_name = "Proceso de gestion de proyecto"
        self.bonita = bonita

    def process_tasks(self, tasks: list[TaskCreate], project_id: int, owner_id: int) -> tuple[list[dict], list[dict]]:
        """
        Procesa las tareas: guarda las tareas locales en DB local y
        retorna las que deben ir en cloud (bonita).

        Returns:
            Tupla con (tareas_locales, tareas_cloud)
        """
        tasks_data = self._prepare_tasks_data(tasks, project_id)
        local_tasks = [t for t in tasks_data if t["resolves_by_itself"]]
        cloud_tasks = [t for t in tasks_data if not t["resolves_by_itself"]]

        if local_tasks:
            self.task_repo.save_tasks_with_ong(local_tasks, owner_id)

        return local_tasks, cloud_tasks

    def _prepare_tasks_data(self, tasks: list[TaskCreate], project_id: int) -> list[dict]:
        """Convierte las tareas a dict y agrega el project_id"""
        return [
            {**task.model_dump(), "project_id": project_id}
            for task in tasks
        ]

    def verify_task_id_exists(self, task_id: int) -> None:
        id_task = self.task_repo.get_by_id(task_id)
        if not id_task:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No existe una tarea con id={task_id}.",)

    def commit_task_to_ong(self, task_id: int, ong_id: int, project_id: int) -> None:
        # project_id: deberia ser el mismo en cloud y en local
        # task_id: corresponde a la task en cloud
        from app.services.project_service import ProjectService
        self.project_service = ProjectService(self.task_repo.db)
        case_id = self.project_service.get_project(project_id).bonita_case_id
        try:
            self._send_to_bonita(case_id, {
                "compromiseInput": {
                    "compromise_task_id": task_id,
                    "compromise_ong_id": ong_id,
                }
            })
        except Exception:
            self.task_repo.db.rollback()
            raise

    def select_ong_for_task(self, task_id: int, ong_id: int, project_id: int) -> None:
        from app.services.project_service import ProjectService
        self.project_service = ProjectService(self.task_repo.db)
        case_id = self.project_service.get_project(project_id).bonita_case_id
        try:
            self._send_to_bonita(case_id, {
                "selectCompromiseInput": {
                    "select_comp_task_id": task_id,
                    "select_comp_ong_id": ong_id,
                }
            }) 
        except Exception:
            self.task_repo.db.rollback()
            raise

    def _send_to_bonita(self, case_id: int, payload: dict) -> None:
        tasks = self.bonita.start_human_tasks(case_id)
        time.sleep(1)
        if not tasks:
            raise Exception(f"No hay tareas humanas disponibles para el caso {case_id}")
        next_task_id = tasks[0]["id"]
        time.sleep(1)
        self.bonita.assign_task(next_task_id)
        self.bonita.send_form_data(next_task_id, payload)
