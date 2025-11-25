from app.models.project import Project
from app.repositories.base_repository import BaseRepository
from app.models.task import Task
from typing import List
from sqlalchemy import func, case 


class ProjectRepository(BaseRepository):
    def __init__(self, db):
        super().__init__(db, Project)

    def get_by_status(self, status: str) -> list[Project]:
        return self.db.query(self.model).filter(self.model.status == status).all()

    def get_projects_by_owner_ids(self, owner_ids: List[int]) -> list[Project]:
        if not owner_ids:
            return []
        return self.db.query(self.model).filter(self.model.owner_id.in_(owner_ids)).all()

    def get_project_by_name(self, name: str) -> Project | None:
        return self.db.query(self.model).filter(self.model.name == name).first()

    def get_projects_with_tasks_by_owner_ids(self, owner_ids: List[int]) -> list[Project]:
        if not owner_ids:
            return []
        return (
            self.db.query(self.model)
            .filter(self.model.owner_id.in_(owner_ids))
            .join(Task)
            .distinct()
            .all()
        )

    def get_projects_solved_without_collaboration(self) -> list[Project]:
        # Proyectos donde:
        # - status == 'execution'
        # - todas sus tasks tienen resolves_by_itself = True

        return (
            self.db.query(self.model)
            .join(Task)
            .filter(self.model.status == "execution")   # <-- FILTRO NUEVO
            .group_by(self.model.id)
            .having(
                func.sum(
                    case(
                        (Task.resolves_by_itself == True, 1),
                        else_=0
                    )
                ) == func.count(Task.id)
            )
            .all()
        )
