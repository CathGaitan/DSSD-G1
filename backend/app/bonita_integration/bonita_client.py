import requests
import os


def login_bonita() -> dict:
    login_url = os.getenv("BONITA_URL") + "/loginservice"
    data = {
        "username": "walter.bates",
        "password": "bpm",
        "redirect": "false"
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    response = requests.post(data=data, url=login_url, headers=headers)
    if response.status_code != 200:
        raise Exception(
            f"Error al loguearse en Bonita:\n"
            f"Status: {response.status_code}\n"
            f"Reason: {response.reason}\n"
            f"URL: {response.url}\n"
            f"Body: {response.text}\n"
            f"Headers: {response.headers}"
        )
    jsession = response.cookies.get("JSESSIONID")

    return {
        "session": jsession,
        "cookies": response.cookies,
        "headers": {
            "Cookie": f"JSESSIONID={jsession}"
        }
    }
