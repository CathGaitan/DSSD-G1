from app.repositories.task_ong_association_repository import TaskOngAssociationRepository
from sqlalchemy.orm import Session


class TaskOngAssociationService:
    def __init__(self, db: Session):
        self.repo = TaskOngAssociationRepository(db)

    def get_all(self):
        return self.repo.get_all()
