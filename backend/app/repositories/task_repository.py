from app.models.task import Task
from app.repositories.base_repository import BaseRepository
from app.schemas.task_schema import TaskCreate
from app.models.task_ong import TaskOngAssociation


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

    def save_tasks_with_ong(self, tasks: list, ong_id: int):
        """
        Crea múltiples tareas y las asocia a una misma ONG con status 'owner'.
        """
        try:
            new_tasks = []
            for task_dict in tasks:
                task_data = TaskCreate(**task_dict)
                new_task = Task(
                    title=task_data.title,
                    necessity=task_data.necessity,
                    quantity=task_data.quantity,
                    start_date=task_data.start_date,
                    end_date=task_data.end_date,
                    resolves_by_itself=task_data.resolves_by_itself,
                    project_id=task_data.project_id
                )
                self.db.add(new_task)
                new_tasks.append(new_task)

            self.db.commit()
            [self.db.refresh(t) for t in new_tasks]
            associations = [TaskOngAssociation(task_id=task.id, ong_id=ong_id, status="owner") for task in new_tasks]
            self.db.add_all(associations)
            self.db.commit()
            return new_tasks
        except Exception as e:
            self.db.rollback()
            raise e