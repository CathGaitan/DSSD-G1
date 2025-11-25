import os
import requests


class BonitaClient:
    def __init__(self):
        self.base_url = os.getenv("BONITA_URL")
        self.session = requests.Session()
        self.logged_in = False

    def login(self, username: str, password: str):
        login_url = f"{self.base_url}/loginservice"
        payload = {
            "username": username,
            "password": password,
            "redirect": "false"
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        response = self.session.post(login_url, data=payload, headers=headers)
        if response.status_code not in (200, 204):
            raise Exception(f"Error {response.status_code}: {response.text}")
        token = response.cookies.get("X-Bonita-API-Token")
        print(f"Token de Bonita recibido: {token!r}")
        if token:
            self.session.headers.update({"X-Bonita-API-Token": token})
            self.logged_in = True
            return {"X-Bonita-API-Token": token}
        raise Exception("No se obtuvo token de sesión de Bonita.")

    def get_all_processes(self):
        url = f"{self.base_url}/API/bpm/process?p=0&c=100"
        response = self.session.get(url)
        response.raise_for_status()
        return response.json()

    def initiate_process(self, id):
        url = f"{self.base_url}/API/bpm/process/{id}/instantiation"
        response = self.session.post(url)
        response.raise_for_status()
        return response.json()

    def get_process_id_by_name(self, name):
        url = f"{self.base_url}/API/bpm/process?p=0&c=100&f=name={name}"
        response = self.session.get(url)
        response.raise_for_status()
        processes = response.json()
        if processes:
            return processes[0].get("id")
        return None

    def start_human_tasks(self, case_id):
        url = f"{self.base_url}/API/bpm/humanTask?f=caseId={case_id}"
        response = self.session.get(url)
        response.raise_for_status()
        return response.json()

    def _get_current_user_id(self):
        url = f"{self.base_url}/API/system/session/unusedId"
        response = self.session.get(url)
        session_info = response.json()
        return session_info.get("user_id")

    def assign_task(self, task_id):
        url = f"{self.base_url}/API/bpm/userTask/{task_id}"
        data = {"assigned_id": self._get_current_user_id()}
        response = self.session.put(url, json=data)
        response.raise_for_status()
        return {"success": True, "task_id": task_id}

    def send_form_data(self, task_id, form_data):
        url = f"{self.base_url}/API/bpm/userTask/{task_id}/execution"
        response = self.session.post(url, json=form_data)
        response.raise_for_status()
        return {"ok": "ok"}

    def set_variable(self, case_id: int, variable_name: str, type: str, value: str):
        url = f"{self.base_url}/API/bpm/caseVariable/{case_id}/{variable_name}"
        payload = { "type": type, "value": value}
        response = self.session.put(url, json=payload)
        response.raise_for_status()
        return "Variable set successfully"

    def get_variable(self, case_id, variable_name):
        url = f"{self.base_url}/API/bpm/caseVariable/{case_id}/{variable_name}"
        response = self.session.get(url)
        if response.status_code == 404:
            return {"error": "Variable not found"}
        response.raise_for_status()
        return response.json()

    def get_business_variable(self, case_id, variable_name):
        url = f"{self.base_url}/API/bdm/businessData/{variable_name}?c=caseId={case_id}"
        response = self.session.get(url)
        if response.status_code == 404:
            return {"error": "Variable not found"}
        response.raise_for_status()
        return response.json()
