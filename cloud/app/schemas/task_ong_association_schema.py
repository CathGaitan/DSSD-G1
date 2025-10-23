from pydantic import BaseModel
from datetime import date
from app.schemas.task_schema import TaskResponse
from app.schemas.ong_schema import OngResponse


class TaskOngAssociationDetailedResponse(BaseModel):
    task_id: int
    ong_id: int
    status: str
    selected_at: date | None = None
    task: TaskResponse
    ong: OngResponse

    model_config = {
        "from_attributes": True
    }
