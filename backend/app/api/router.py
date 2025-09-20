@app.get("/")
def read_root():
    return {"message": "Hola desde FastAPI 🚀"}
