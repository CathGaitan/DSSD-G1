from fastapi import APIRouter, Body
from app.bonita_integration.bonita_client import BonitaClient


router = APIRouter()
bonita = BonitaClient()


@router.post("/test_login")
def test_login():
    session_info = bonita.login()
    return {session_info}


@router.get("/test_processes")
def test_get_processes():
    processes = bonita.get_all_processes()
    return {"processes": processes}


@router.get("/prueba_get_id")
def test_get_process_id_by_name(name: str):
    process_id = bonita.get_process_id_by_name(name)
    return {"process_id": process_id}

@router.post("/test_initiate_process/{process_id}")
def test_initiate_process(process_id: int):
    initiation_response = bonita.initiate_process(process_id)
    return {"initiation_response": initiation_response}

@router.get("/test_human_tasks/{case_id}")
def test_get_human_tasks(case_id: int):
    tasks = bonita.start_human_tasks(case_id)
    return {"tasks": tasks}


@router.post("/send_form_data")
def test_send_form_data(task_id: int, form_data: dict):
    response = bonita.send_form_data(task_id, form_data)
    return {"response": response}


@router.put("/set_variable/{case_id}/{variable_name}")
def test_set_variable(case_id: int, variable_name: str, value: str):
    bonita.set_variable(case_id, variable_name, "java.lang.String", value)
    return {"status": "Variable set successfully"}

@router.get("/get_variable/{case_id}/{variable_name}")
def test_get_variable(case_id: int, variable_name: str):
    variable = bonita.get_variable(case_id, variable_name)
    return {"variable": variable}

@router.post("/assign_task/{task_id}")
def test_assign_task(task_id: int):
    response = bonita.assign_task(task_id)
    return {"response": response}


@router.get("/current_user_id")
def test_get_current_user_id():
    user_id = bonita.get_current_user_id()
    return {"user_id": user_id}