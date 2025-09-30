import os
import requests
from app.core.exceptions import BonitaAPIError


class BonitaClient:
    def __init__(self):
        self.base_url = os.getenv("BONITA_URL")
        self.session = requests.Session()
        self.logged_in = False

    def login(self):
        login_url = f"{self.base_url}/loginservice"
        payload = {
            "username": "walter.bates",
            "password": "bpm",
            "redirect": "false"
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        response = self.session.post(login_url, data=payload, headers=headers)
        if response.status_code not in (200, 204):
            raise BonitaAPIError(status_code=response.status_code, url=response.url, body=response.text, headers=response.headers)
        self.logged_in = True
        token = response.cookies.get("X-Bonita-API-Token")
        if token:
            self.session.headers.update({"X-Bonita-API-Token": token})

    def is_logged(self):
        if not self.logged_in:
            self.login()

    def get_all_processes(self):
        self.is_logged()
        url = f"{self.base_url}/API/bpm/process?p=0&c=100"
        response = self.session.get(url)
        response.raise_for_status()
        return response.json()

    def initiate_process(self, id):
        self.is_logged()
        url = f"{self.base_url}/API/bpm/process/{id}/instantiation"
        response = self.session.post(url)
        response.raise_for_status()
        return response.json()

    def get_process_id_by_name(self, name):
        self.is_logged()
        url = f"{self.base_url}/API/bpm/process?p=0&c=100&f=name={name}"
        response = self.session.get(url)
        response.raise_for_status()
        processes = response.json()
        if processes:
            return processes[0].get("id")
        return None

    def start_human_tasks(self, case_id):
        self.is_logged()
        url = f"{self.base_url}/API/bpm/humanTask?f=caseId={case_id}"
        response = self.session.get(url)
        response.raise_for_status()
        return response.json()

    def _get_current_user_id(self):
        self.is_logged()
        url = f"{self.base_url}/API/system/session/unusedId"
        response = self.session.get(url)
        session_info = response.json()
        return session_info.get("user_id")

    def assign_task(self, task_id):
        self.is_logged()
        url = f"{self.base_url}/API/bpm/userTask/{task_id}"
        data = {"assigned_id": self._get_current_user_id()}
        response = self.session.put(url, json=data)
        response.raise_for_status()
        return {"success": True, "task_id": task_id}

    def send_form_data(self, task_id, form_data):
        self.is_logged()
        url = f"{self.base_url}/API/bpm/userTask/{task_id}/execution"
        response = self.session.post(url, json=form_data)
        response.raise_for_status()
        return {"ok": "ok"}

    def set_variable(self, case_id: int, variable_name: str, type: str, value: str):
        self.is_logged()
        url = f"{self.base_url}/API/bpm/caseVariable/{case_id}/{variable_name}"
        payload = { "type": type, "value": value}
        response = self.session.put(url, json=payload)
        response.raise_for_status()
        return "Variable set successfully"

    def get_variable(self, case_id, variable_name):
        self.is_logged()
        url = f"{self.base_url}/API/bpm/caseVariable/{case_id}/{variable_name}"
        response = self.session.get(url)
        if response.status_code == 404:
            return {"error": "Variable not found"}
        response.raise_for_status()
        return response.json()

