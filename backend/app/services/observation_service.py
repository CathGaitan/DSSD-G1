from sqlalchemy.orm import Session
from app.bonita_integration.bonita_api import bonita
from app.schemas.observation_schema import ObservationBase, ObservationResponse
from datetime import date
import time


class ObservationService:
    def __init__(self, db: Session):
        self.bonita = bonita
        self.process_name = "Proceso de control sobre proyecto"

    def send_observation_to_bonita(self, observation: ObservationBase, current_user) -> dict:
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
        return {"case_id": case_id}
