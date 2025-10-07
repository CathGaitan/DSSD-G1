class BonitaAPIError(Exception):
    def __init__(self, status_code: int, url: str, body: str = None, headers: dict = None):
        self.status_code = status_code
        self.url = url
        self.body = body
        self.headers = headers
        self.message = f"BonitaAPIError {status_code} en {url}"
        super().__init__(self.message)

    def full_info(self) -> dict:
        return {
            "status_code": self.status_code,
            "url": self.url,
            "body": self.body,
            "headers": self.headers,
        }
