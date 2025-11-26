from pydantic import BaseModel
from typing import List

class ONGPerformance(BaseModel):
    name: str
    tasks_completed: int
    collaborations_done: int

class StatsResponse(BaseModel):
    successful_on_time_avg: float
    percent_no_collaboration_needed: float
    top_3_ongs: List[ONGPerformance]


# Chequear si es necesario agregar más esquemas relacionados con indicadores 