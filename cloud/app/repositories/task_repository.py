from app.models.task import Task
from app.repositories.base_repository import BaseRepository


class TaskRepository(BaseRepository):
    def __init__(self, db):
        super().__init__(db, Task)

    def create_multiple_tasks(self, tasks_data):
        tasks = [Task(**data) for data in tasks_data]
        self.db.add_all(tasks)
        self.db.commit()
        for task in tasks:
            self.db.refresh(task)
        return tasks
