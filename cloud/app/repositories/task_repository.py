from app.repositories.base_repository import BaseRepository
from app.models.task import Task
from app.models.task_ong import TaskOngAssociation
from datetime import datetime       


class TaskRepository(BaseRepository):
    def __init__(self, db):
        super().__init__(db, Task)

    def commit_task_to_ong(self, task_id: int, ong_id: int):
        """
        Guarda la relación entre una Task y una ONG en la tabla intermedia
        """
        existing = self.db.query(TaskOngAssociation).filter(
            TaskOngAssociation.task_id == task_id,
            TaskOngAssociation.ong_id == ong_id
        ).first()
        if existing:
            raise Exception("Esta ONG ya se ha comprometido con esta tarea")
        association = TaskOngAssociation(task_id=task_id, ong_id=ong_id, status="interested")
        try:
            self.db.add(association)
            self.db.commit()
            return {"message": "Compromiso guardado exitosamente"}
        except Exception as e:
            self.db.rollback()
            raise e

    def select_ong_for_task(self, task_id: int, selected_ong_id: int):
        """
        Selecciona una ONG como ganadora para ayudar con la Task.
        Marca su status como 'selected' y rechaza a las demás.
        """
        try:
            associations = self.db.query(TaskOngAssociation).filter(TaskOngAssociation.task_id == task_id).all()
            for assoc in associations:
                if assoc.ong_id == selected_ong_id:
                    assoc.status = "selected"
                    assoc.selected_at = datetime.now()
                else:
                    assoc.status = "rejected"
            self.db.commit()
            return {"message": "ONG seleccionada exitosamente"}
        except Exception as e:
            self.db.rollback()
            raise e

    def has_ong_applied_for_task(self, task_id: int, ong_id: int) -> bool:
        assoc = (self.db.query(TaskOngAssociation).filter(
                TaskOngAssociation.task_id == task_id,
                TaskOngAssociation.ong_id == ong_id
            ).first())
        return assoc is not None and assoc.status == "interested"

    def create_multiple_tasks(self, tasks_data):
        tasks = [Task(**data) for data in tasks_data]
        self.db.add_all(tasks)
        self.db.commit()
        for task in tasks:
            self.db.refresh(task)
        return tasks

    def has_ong_association(self, task_id: int) -> bool:
        return (
            self.db.query(TaskOngAssociation)
            .filter(TaskOngAssociation.task_id == task_id)
            .first()
            is not None
        )

    def get_ong_association(self, task_id: int):
        return (
            self.db.query(TaskOngAssociation)
            .filter(TaskOngAssociation.task_id == task_id)
            .first()
        )
