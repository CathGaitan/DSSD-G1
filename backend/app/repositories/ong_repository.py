from app.repositories.base_repository import BaseRepository
from app.models.ong import Ong
from sqlalchemy import func, case
from app.models.project import Project
from app.models.task import Task


class OngRepository(BaseRepository):
    def __init__(self, db):
        super().__init__(db, Ong)

    def get_by_name(self, name: str) -> Ong | None:
        return self.db.query(Ong).filter(Ong.name == name).one_or_none()

    def get_ongs_with_self_resolved_tasks(self):
        result = (
            self.db.query(
                Ong.name.label("ong_name"),
                func.sum(
                    case(
                        (Task.resolves_by_itself == True, 1),
                        else_=0
                    )
                ).label("resolved_tasks")
            )
            .join(Project, Project.owner_id == Ong.id)
            .join(Task, Task.project_id == Project.id)
            .group_by(Ong.id)
            .all()
        )

        # Lo devuelvo como lista de dicts (más cómodo para el service)
        return [
            {
                "ong_name": row.ong_name,
                "resolved_tasks": int(row.resolved_tasks or 0)
            }
            for row in result
        ]