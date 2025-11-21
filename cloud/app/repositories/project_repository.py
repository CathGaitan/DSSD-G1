from typing import List
from app.repositories.base_repository import BaseRepository
from app.models.task import Task
from app.models.project import Project
from app.models.task_ong import TaskOngAssociation


class ProjectRepository(BaseRepository):
    def __init__(self, db):
        super().__init__(db, Project)

    def get_project_by_name(self, name: str):
        return self.db.query(Project).filter(Project.name == name).first()

    def get_by_status(self, status: str) -> list[Project]:
        return self.db.query(self.model).filter(self.model.status == status).all()

    def get_projects_not_owned_by_and_active(self, owner_ids: List[int]) -> list[Project]:
        return self.db.query(self.model).filter(
            self.model.owner_id.notin_(owner_ids),
            self.model.status == "active"
        ).all()

    def get_projects_with_requests(self, owner_id: int) -> list[Project]:
        return (
            self.db.query(Project)
            .join(Task, Task.project_id == Project.id)
            .join(TaskOngAssociation, TaskOngAssociation.task_id == Task.id)
            .filter(
                Project.owner_id == owner_id,
                TaskOngAssociation.status == "interested"
            )
            .distinct()
            .all()
        )
    
    def get_projects_by_owner_ids(self, owner_ids: List[int]) -> list[Project]:
        if not owner_ids:
            return []
        return self.db.query(self.model).filter(self.model.owner_id.in_(owner_ids)).all()