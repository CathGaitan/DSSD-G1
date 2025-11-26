from app.repositories.base_repository import BaseRepository
from app.models.ong import Ong
from app.models.task_ong import TaskOngAssociation
from sqlalchemy import func
from app.models.task import Task
from app.models.project import Project


class OngRepository(BaseRepository):
    def __init__(self, db):
        super().__init__(db, Ong)

    def get_by_name(self, name: str) -> Ong | None:
        return self.db.query(Ong).filter(Ong.name == name).one_or_none()

    def get_ongs_with_collaborations(self): 
        result = (
            self.db.query(
                Ong.name.label("ong_name"),
                func.count(TaskOngAssociation.task_id).label("collaborations")
            )
            .join(TaskOngAssociation, Ong.id == TaskOngAssociation.ong_id)
            .join(Task, Task.id == TaskOngAssociation.task_id)
            .join(Project, Project.id == Task.project_id)
            .filter(TaskOngAssociation.status == "selected")
            .filter(Project.owner_id != Ong.id)
            .group_by(Ong.id)
            .all()
        )
        return [
            {
                "ong_name": row.ong_name, 
                "collaborations": row.collaborations
            }
            for row in result
        ]
