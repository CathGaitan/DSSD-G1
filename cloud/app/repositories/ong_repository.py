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
          """
        Retorna una lista de tuplas (ong_name, total_colaboraciones)
        contando solo tareas donde la ONG fue seleccionada (status='selected')
        y NO es la dueña del proyecto.
        """
          return (
            self.db.query(
                Ong.name.label("ong_name"),
                func.count(TaskOngAssociation.task_id).label("collaborations")
            )
            .join(TaskOngAssociation, Ong.id == TaskOngAssociation.ong_id)
            .join(Task, Task.id == TaskOngAssociation.task_id)
            .join(Project, Project.id == Task.project_id)
            .filter(TaskOngAssociation.status == "selected")
            .filter(Project.owner_id != Ong.id)  # evita contar colaboraciones de sus propios proyectos
            .group_by(Ong.id)
            .all()
        )
      