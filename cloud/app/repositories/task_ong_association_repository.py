from app.models.task_ong import TaskOngAssociation
from sqlalchemy.orm import Session


class TaskOngAssociationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(TaskOngAssociation).all()
