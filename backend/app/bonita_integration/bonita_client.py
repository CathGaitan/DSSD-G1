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
