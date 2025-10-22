from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.ong import Ong
from app.models.user import User
from app.models.project import Project
from app.models.task import Task
from app.models.task_ong import TaskOngAssociation


def seed_ongs(db: Session):
    """Crea ONGs de prueba"""
    ongs_data = [
        {"name": "Fundación Educativa"},
        {"name": "Asociación de Salud"},
        {"name": "ONG Ambiental"},
        {"name": "Voluntarios Comunitarios"},
    ]
    
    for ong_data in ongs_data:
        existing = db.query(Ong).filter(Ong.name == ong_data["name"]).first()
        if not existing:
            ong = Ong(**ong_data)
            db.add(ong)
    
    db.commit()
    return db.query(Ong).all()


def seed_users(db: Session):
    """Crea usuarios de prueba"""
    from passlib.context import CryptContext
    
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    users_data = [
        {
            "username": "juan_admin",
            "email": "juan@example.com",
            "hashed_password": pwd_context.hash("password123")
        },
        {
            "username": "maria_user",
            "email": "maria@example.com",
            "hashed_password": pwd_context.hash("password123")
        },
        {
            "username": "carlos_dev",
            "email": "carlos@example.com",
            "hashed_password": pwd_context.hash("password123")
        },
        {
            "username": "ana_volunteer",
            "email": "ana@example.com",
            "hashed_password": pwd_context.hash("password123")
        },
    ]
    
    for user_data in users_data:
        existing = db.query(User).filter(User.username == user_data["username"]).first()
        if not existing:
            user = User(**user_data)
            db.add(user)
    
    db.commit()
    return db.query(User).all()


def seed_user_ongs(db: Session):
    """Asocia usuarios con ONGs"""
    users = db.query(User).all()
    ongs = db.query(Ong).all()
    
    if len(users) >= 2 and len(ongs) >= 2:
        # Juan con Fundación Educativa y Asociación de Salud
        users[0].ongs.append(ongs[0])
        users[0].ongs.append(ongs[1])
        
        # Maria con ONG Ambiental
        users[1].ongs.append(ongs[2])
        
        # Carlos con Voluntarios Comunitarios
        users[2].ongs.append(ongs[3])
        
        # Ana con todas
        for ong in ongs:
            if ong not in users[3].ongs:
                users[3].ongs.append(ong)
        
        db.commit()


def seed_projects(db: Session):
    """Crea proyectos de prueba"""
    ongs = db.query(Ong).all()
    
    if not ongs:
        print("No hay ONGs disponibles para crear proyectos")
        return
    
    today = datetime.now().date()
    projects_data = [
        {
            "name": "Programa de Educación Digital",
            "description": "Enseñanza de tecnología en comunidades rurales",
            "start_date": today,
            "end_date": today + timedelta(days=90),
            "owner_id": ongs[0].id,
            "status": "active"
        },
        {
            "name": "Campaña de Salud Preventiva",
            "description": "Jornadas de atención médica gratuita",
            "start_date": today,
            "end_date": today + timedelta(days=60),
            "owner_id": ongs[1].id,
            "status": "active"
        },
        {
            "name": "Reforestación Urbana",
            "description": "Plantación de árboles en la ciudad",
            "start_date": today + timedelta(days=7),
            "end_date": today + timedelta(days=180),
            "owner_id": ongs[2].id,
            "status": "completed"
        },
        {
            "name": "Centro Comunitario",
            "description": "Construcción de centro de actividades",
            "start_date": today - timedelta(days=30),
            "end_date": today + timedelta(days=120),
            "owner_id": ongs[3].id,
            "status": "active"
        },
    ]
    
    for project_data in projects_data:
        existing = db.query(Project).filter(Project.name == project_data["name"]).first()
        if not existing:
            project = Project(**project_data)
            db.add(project)
    
    db.commit()
    return db.query(Project).all()


def seed_tasks(db: Session):
    """Crea tareas de prueba"""
    projects = db.query(Project).all()
    ongs = db.query(Ong).all()
    
    if not projects or not ongs:
        print("No hay proyectos u ONGs disponibles para crear tareas")
        return
    
    today = datetime.now().date()
    tasks_data = [
        {
            "title": "Desarrollar currícula",
            "start_date": today,
            "end_date": today + timedelta(days=14),
            "necessity": "Material educativo preparado",
            "quantity": "5 módulos",
            "resolves_by_itself": False,
            "project_id": projects[0].id,
        },
        {
            "title": "Preparar recursos",
            "start_date": today + timedelta(days=15),
            "end_date": today + timedelta(days=30),
            "necessity": "Computadoras y software",
            "quantity": "20 equipos",
            "resolves_by_itself": False,
            "project_id": projects[0].id,
        },
        {
            "title": "Capacitación de médicos",
            "start_date": today,
            "end_date": today + timedelta(days=7),
            "necessity": "Protocolos de atención",
            "quantity": "15 doctores",
            "resolves_by_itself": False,
            "project_id": projects[1].id,
        },
        {
            "title": "Obtener permisos municipales",
            "start_date": today + timedelta(days=7),
            "end_date": today + timedelta(days=21),
            "necessity": "Autorización oficial",
            "quantity": "3 documentos",
            "resolves_by_itself": True,
            "project_id": projects[2].id,
        },
        {
            "title": "Compra de semillas",
            "start_date": today + timedelta(days=7),
            "end_date": today + timedelta(days=14),
            "necessity": "Especies nativas",
            "quantity": "1000 semillas",
            "resolves_by_itself": False,
            "project_id": projects[2].id,
        },
        {
            "title": "Excavación del terreno",
            "start_date": today - timedelta(days=20),
            "end_date": today + timedelta(days=30),
            "necessity": "Preparar la base",
            "quantity": "500 m2",
            "resolves_by_itself": False,
            "project_id": projects[3].id,
        },
    ]
    
    for task_data in tasks_data:
        existing = db.query(Task).filter(Task.title == task_data["title"]).first()
        if not existing:
            task = Task(**task_data)
            db.add(task)
    
    db.commit()
    
    # Asociar tareas con ONGs
    # tasks = db.query(Task).all()
    # if len(tasks) >= 2 and len(ongs) >= 1:
    #     tasks[0].ongs.append(ongs[0])
    #     tasks[1].ongs.append(ongs[0])
    #     tasks[2].ongs.append(ongs[1])
    #     tasks[3].ongs.append(ongs[2])
    #     tasks[4].ongs.append(ongs[2])
    #     tasks[5].ongs.append(ongs[3])
    #     db.commit()
    
    return None


def run_seeds():
    """Ejecuta todos los seeds"""
    db = SessionLocal()
    
    try:
        print("🌱 Iniciando seeds...")
        
        print("  - Creando ONGs...")
        seed_ongs(db)
        
        print("  - Creando usuarios...")
        seed_users(db)
        
        print("  - Asociando usuarios con ONGs...")
        seed_user_ongs(db)
        
        print("  - Creando proyectos...")
        seed_projects(db)
        
        print("  - Creando tareas...")
        seed_tasks(db)
        
        print("✅ Seeds ejecutados correctamente!")
        
    except Exception as e:
        print(f"❌ Error en seeds: {str(e)}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    run_seeds()