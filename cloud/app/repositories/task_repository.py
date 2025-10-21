from app.repositories.base_repository import BaseRepository
from app.models.task import Task
from app.models.task_ong import task_ongs
from sqlalchemy import insert


class TaskRepository(BaseRepository):
    def __init__(self, db):
        super().__init__(db, Task)

    def commit_task_to_ong(self, task_id: int, ong_id: int):
        """
        Guarda la relación entre una Task y una ONG en la tabla intermedia
        """
        stmt = insert(task_ongs).values(task_id=task_id, ong_id=ong_id)
        try:
            self.db.execute(stmt)
            self.db.commit()
            return {"message": "Compromiso guardado exitosamente"}
        except Exception as e:
            self.db.rollback()
            raise e

    def create_multiple_tasks(self, tasks_data):
        tasks = [Task(**data) for data in tasks_data]
        self.db.add_all(tasks)
        self.db.commit()
        for task in tasks:
            self.db.refresh(task)
        return tasks
