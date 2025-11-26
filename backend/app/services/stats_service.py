from app.bonita_integration.bonita_api import bonita
from app.services.project_service import ProjectService
from app.services.ong_service import OngService
from sqlalchemy.orm import Session
# from app.services.cloud_client import cloud_client
from datetime import datetime
from app.schemas.stats_schema import StatsResponse
import time
import logging

logger = logging.getLogger(__name__)

class StatsService:

    def __init__(self, db: Session):
        self.bonita = bonita
        # cloud client has to get data from api and may be necessary to create new endpoints
        # self.cloud_client = cloud_client
        self.project_service = ProjectService(db)
        self.ong_service = OngService(db)
        self.process_name = "Proceso de gestion de proyecto"
        self.process_id = None

    # este método pedorro no anda bien... 
    def _ensure_process_id(self):
            """
            Obtiene y guarda el process_id.
            Si falla → log + mantiene process_id = None.
            """
            if self.process_id:
                return

            try:
                logger.info("Buscando process_id para '%s'...", self.process_name)
                self.process_id = self.bonita.get_process_id_by_name(self.process_name)
                time.sleep(2)  # Le da tiempo a Bonita para actualizar
                logger.info("process_id obtenido: %s", self.process_id)
            except Exception as e:
                logger.error("Error obteniendo process_id de Bonita: %s", e)
                self.process_id = None

    # andando bien
    def get_successful_on_time_avg(self) -> float:
        # self._ensure_process_id()
        self.process_id = self.bonita.get_process_id_by_name(self.process_name)
        time.sleep(2)  # Le da tiempo a Bonita para actualizar
        if not self.process_id:
            logger.warning("No process_id disponible — retornando 0.")
            return 0.0

        try:
            # Obtener todos los archivedCases del proceso ANDA
            archived_cases = self.bonita.get_archived_cases(self.process_id)
            time.sleep(1)
            logger.info("Archived cases recuperados: %s", len(archived_cases))
        except Exception as e:
            logger.error("Error consultando archived_cases: %s", e)
            raise

        # Filtrar solo los casos archivados COMPLETADOS del proceso
        completed_cases = [
            c for c in archived_cases
            if str(c.get("processDefinitionId")) == str(self.process_id)
            and c.get("state") == "completed"
        ]

        total_cases = len(completed_cases)
        logger.info("Total de casos completados: %s", total_cases)
        print("Total de casos completados: %s", total_cases) # hasta acá anda

        if total_cases == 0:
            return 0.0

        successful_cases = 0

        for case in completed_cases:
            end_date_str = case.get("end_date")
            print("end_date_str:", end_date_str)
            if not end_date_str:
                continue

            # Parse end_date del archivedCase
            try:
                case_end_date = datetime.strptime(end_date_str, "%Y-%m-%d %H:%M:%S.%f")
            except ValueError:
                logger.warning("Formato inválido de end_date: %s", end_date_str)
                continue

            # Obtener sourceObjectId = ID ORIGINAL del caso en ejecución
            original_case_id = case.get("sourceObjectId")
            print("original_case_id:", original_case_id)
            if not original_case_id:
                logger.warning("ArchivedCase sin sourceObjectId, id=%s", case.get("id"))
                continue

            # Leer variable project_end_date del case original
            try:
                var = self.bonita.get_variable_from_archived_case(original_case_id, "project_end_date")
                time.sleep(1)
                print("Variable project_end_date del caso %s: %s", original_case_id, var)
            except Exception as e:
                logger.error("Error leyendo variable project_end_date del caso %s: %s",
                            original_case_id, e)
                continue

            project_end_date_str = var.get("value")
            if not project_end_date_str:
                continue

            project_end_date = datetime.strptime(project_end_date_str, "%Y-%m-%d")

            # Caso exitoso si se completó antes o en la fecha límite
            if case_end_date.date() <= project_end_date.date():
                successful_cases += 1

        result = (successful_cases / total_cases) * 100
        logger.info("Promedio de casos exitosos (on time): %.2f%%", result)
        return result


    def get_percent_no_collaboration_needed(self) -> float:
        # Calcula el porcentaje de proyectos (casos) que no necesitaron colaboraciones de otras ONG
        self.process_id = self.bonita.get_process_id_by_name(self.process_name)
        time.sleep(2)  # Le da tiempo a Bonita para actualizar
        if not self.process_id:
            logger.warning("No process_id disponible — retornando 0.")
            return 0.0
        try:
            # Total proyectos archivados/cerrados en estado completed
            total_projects = self.bonita.get_archived_cases(self.process_id)
            time.sleep(1)
            total_projects = len([c for c in total_projects if c.get("state") == "completed"])
            logger.info("Total de proyectos cerrados: %s", total_projects)
        except Exception as e:
            logger.error("Error consultando count_closed_cases: %s", e)
            raise
        
        if total_projects == 0:
            return 0.0
        try:
            projects_no_collab = len(self.project_service.project_repo.get_projects_solved_without_collaboration())
            logger.info("Proyectos sin colaboración: %s", projects_no_collab)
        except Exception as e:
            logger.error("Error obteniendo proyectos sin colaboración: %s", e)
            raise
        # result = (projects_no_collab / total_projects) * 100
        # result es un dict con projects_no_collab y total_projects
        return {"projects_no_collab": projects_no_collab, "total_projects": total_projects, "percent": (projects_no_collab / total_projects) * 100}

    def get_ongs_and_tasks_resolved(self):
        # Retorna una lista de elementos con cada ong y la cantidad de tareas resueltas 
        return self.ong_service.get_ongs_with_self_resolved_tasks()

