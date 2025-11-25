from app.bonita_integration.bonita_api import bonita
from app.services.project_service import ProjectService
from sqlalchemy.orm import Session
# from app.services.cloud_client import cloud_client
from datetime import datetime
from app.schemas.stats_schema import StatsResponse
import time


class StatsService:

    def __init__(self, db: Session):
        self.bonita = bonita
        # cloud client has to get data from api and may be necessary to create new endpoints
        # self.cloud_client = cloud_client
        self.project_service = ProjectService(db)
        self.process_name = "Proceso de gestion de proyecto"
        self.process_id = None


    def _ensure_process_id(self):
        if not self.process_id:
            self.process_id = self.bonita.get_process_id_by_name(self.process_name)
            time.sleep(2)

    def get_successful_on_time_avg(self) -> float:
        # Lógica para calcular el promedio de proyectos exitosos y a tiempo
        # Obtener todos los casos , comparar fecha de fin y fecha en la que se completó el caso.
        self._ensure_process_id()
        if not self.process_id:
            return 0.0
        total_cases = self.bonita.count_cases(self.process_id) # cuenta el total de casos
        if total_cases == 0:
            return 0.0
        
        cases = self.bonita.get_cases_by_process_id(self.process_id) # obtiene todos los casos
        successful_cases = 0 

        for case in cases:
            # Se cuentan solo los completados
            if case.get("state") != "completed":
                continue

            case_id = case.get("id")

            # Fecha en que el caso terminó
            end_date_str = case.get("end_date")
            if not end_date_str:
                continue

            case_end_date = datetime.strptime(end_date_str, "%Y-%m-%d %H:%M:%S.%f")

            # Obtener variable project_end_date (fecha de finalización del proyecto)
            var = self.bonita.get_variable(case_id, "project_end_date")
            project_end_date_str = var.get("value")
            
            if not project_end_date_str:
                continue

            project_end_date = datetime.strptime(project_end_date_str, "%Y-%m-%d")

            # Caso exitoso y EN TERMINO
            if case_end_date.date() <= project_end_date.date():
                successful_cases += 1

        return (successful_cases / total_cases) * 100
    

    def get_percent_no_collaboration_needed(self) -> float:
        # Calcula el porcentaje de proyectos (casos) que no necesitaron colaboraciones de otras ONG
        self._ensure_process_id()
        if not self.process_id:
            return 0.0
        total_projects = self.bonita.count_closed_cases(self.process_id)
        if total_projects == 0:
            return 0.0
        projects_no_collab = len(self.project_service.project_repo.get_projects_solved_without_collaboration())
        return (projects_no_collab / total_projects) * 100
          
    
    
    def get_top_3_ongs(self):
        # Lógica para obtener las 3 ONG con mejor desempeño
        raise NotImplementedError("get_top_3_ongs will be implemented later") 

    def get_total_stats(self, current_user) -> StatsResponse:
        # Unificar todos los indicadores y devolverlos en un solo objeto stats schema
        try: 
            top_3_ongs = self.get_top_3_ongs()
        except NotImplementedError:
            top_3_ongs = []
            
        return StatsResponse(
            successful_on_time_avg=self.get_successful_on_time_avg(),
            percent_no_collaboration_needed=self.get_percent_no_collaboration_needed(),
            top_3_ongs=top_3_ongs
        )
