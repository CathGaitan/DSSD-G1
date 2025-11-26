from sqlalchemy.orm import Session
from datetime import datetime
from app.schemas.user_schema import UserResponse
from app.repositories.observation_repository import ObservationRepository
from app.schemas.observation_schema import ObservationBase, ObservationResponse
from app.services.project_service import ProjectService


class ObservationService:
    def __init__(self, db: Session):
        self.observation_repo = ObservationRepository(db)
        self.project_service = ProjectService(db)

    def save_observation_to_db(self, observation: ObservationBase) -> dict:
        project = self.project_service.get_project_by_name(observation.project_name)
        obs_dic = {
            **observation.model_dump(exclude={"project_name"}),
            "project_id": project.id
        }
        new_observation = self.observation_repo.create(obs_dic)
        return {"message": "Observation saved successfully", "observation_id": new_observation.id}

    def get_my_observations(self, user: UserResponse) -> list[dict]:
        user_ong_ids = [ong.id for ong in user.ongs]
        observations = self.observation_repo.get_by_ong_ids(user_ong_ids)
        result = []
        for obs in observations:
            result.append({
                "id": obs.id,
                "content": obs.content,
                "user_id": obs.user_id,
                "created_at": obs.created_at,
                "accepted_at": obs.accepted_at,
                "status": obs.status,
                "project_name": obs.project.name if obs.project else "Desconocido",
                "username": obs.user.username if obs.user else "Usuario Desconocido"
            })
        return result

    def accept_observation(self, observation_id: int) -> dict:
        obs = self.observation_repo.get_by_id(observation_id)
        update_data = {
            "status": "accepted",
            "accepted_at": datetime.now()
        }
        self.observation_repo.update(obs, update_data)
        return {"message": "Observation accepted successfully", "observation_id": obs.id}

    def get_user_sent_observations(self, user_id: int) -> list[dict]:
        observations = self.observation_repo.get_by_user_id(user_id)
        result = []
        for obs in observations:
            result.append({
                "id": obs.id,
                "content": obs.content,
                "user_id": obs.user_id,
                "created_at": obs.created_at,
                "status": obs.status,
                "accepted_at": obs.accepted_at,
                "project_name": obs.project.name if obs.project else "Desconocido",
                "username": obs.user.username if obs.user else "Usuario Desconocido"
            })
        return result
