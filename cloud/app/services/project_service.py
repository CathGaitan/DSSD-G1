from app.repositories.project_repository import ProjectRepository
from app.repositories.ong_repository import OngRepository
from sqlalchemy.orm import Session
from app.schemas.project_schema import ProjectCreate, ProjectResponse
from app.services.task_service import TaskService


class ProjectService:
    def __init__(self, db: Session):
        self.project_repo = ProjectRepository(db)
        self.task_service = TaskService(db)
        self.ong_repo = OngRepository(db)

    def get_projects(self) -> list[ProjectResponse]:
        return self.project_repo.get_all()

    def store_projects(self, project_data) -> ProjectResponse:
        print("Storing project data:", project_data)
        try:
            project_dict = project_data.model_dump(exclude={"tasks"})
            owner_name = project_dict.pop("owner_name", None)
            ong = self.ong_repo.get_by_name(owner_name)
            project_dict["owner_id"] = int(ong.id)
            project = self.project_repo.create(project_dict)
            self.task_service.process_and_save_tasks(project_data.tasks, project.id)
            return project
        except Exception as e:
            self.project_repo.db.rollback()
            raise e
