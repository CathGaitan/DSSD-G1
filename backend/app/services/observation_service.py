from app.services.project_service import ProjectService
from sqlalchemy.orm import Session
from app.bonita_integration.bonita_api import bonita
from app.schemas.observation_schema import ObservationBase, ObservationResponse
from app.repositories.observation_repository import ObservationRepository
from datetime import date
import time


class ObservationService:
    def __init__(self, db: Session):
        self.bonita = bonita
        self.obs_repo = ObservationRepository(db)
        self.project_service = ProjectService(db)
        self.process_name = "Proceso de control sobre proyecto"

    def send_observation_to_bonita(self, observation: ObservationBase, current_user) -> dict:
        try:
            process_id = self.bonita.get_process_id_by_name(self.process_name)
            time.sleep(1)
            case_id = self.bonita.initiate_process(process_id).get("caseId")
            time.sleep(1)
            task_id = self.bonita.start_human_tasks(case_id)[0].get("id")
            self.bonita.assign_task(task_id)
            self.bonita.send_form_data(task_id, {
                "inputObservations": {
                    "observationContent": observation.content,
                    "projectName": observation.project_name,
                    "observationCreatedAt": date.today().strftime("%Y-%m-%d"),
                    "userId": current_user.id,
                    "ongId": observation.ong_id
                }
            })
            project = self.project_service.get_project_by_name(observation.project_name)
            obs = {
                "content": observation.content,
                "project_id": project.id,
                "created_at": date.today().strftime("%Y-%m-%d"),
                "user_id": current_user.id,
                "case_id": case_id
            }
            self.obs_repo.create(obs)
            return {"case_id": case_id}
        except Exception:
            self.obs_repo.db.rollback()
            raise

    def accept_observation(self, observation_id: int, current_user) -> dict:
        case_id = self.obs_repo.get_by_id(observation_id).case_id
        tasks = self.bonita.start_human_tasks(case_id)
        time.sleep(1)
        if not tasks:
            raise Exception(f"No hay tareas humanas disponibles para el caso {case_id}")
        next_task_id = tasks[0]["id"]
        time.sleep(1)
        self.bonita.assign_task(next_task_id)
        self.bonita.send_form_data(next_task_id, {
            "acceptObservationInput": {
                "acceptObservationId": observation_id,
                "acceptObservationDate": date.today().strftime("%Y-%m-%d"),
            }
        })
        return {"message": f"Observación {observation_id} aceptada correctamente."}