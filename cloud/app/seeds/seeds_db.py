from datetime import date
from app.core.database import SessionLocal
from app.models.ong import Ong
from app.models.project import Project
from app.models.task import Task
from app.core.database import Base, engine

def reset_database():
    # Borrar todas las tablas
    Base.metadata.drop_all(bind=engine)
    print("🗑️ Deleting tables")

    # Crear todas las tablas
    Base.metadata.create_all(bind=engine)
    print("✅ Creating tables")

def run_seeds():
    db = SessionLocal()

    try:
        if not db.query(Ong).first():
            ong1 = Ong(name="GreenPeace")
            ong2 = Ong(name="UNICEF")
            ong3 = Ong(name="Asociación madres Plaza de Mayo")
            db.add_all([ong1, ong2, ong3])
            db.commit()
            print("✅ ONGs seeded")
        else:
            ong1 = db.query(Ong).filter_by(name="GreenPeace").first()
            ong2 = db.query(Ong).filter_by(name="UNICEF").first()

        if not db.query(Project).first():
            project1 = Project(
                name="Comedor Comunitario",
                description="Proyecto para brindar comidas a familias en situación vulnerable.",
                start_date=date(2025, 1, 1),
                end_date=date(2025, 6, 30),
                ong_responsable=ong2,
                status="active",
            )

            project2 = Project(
                name="Campaña Escolar",
                description="Recolección y distribución de útiles escolares.",
                start_date=date(2025, 2, 1),
                end_date=date(2025, 3, 15),
                ong_responsable=ong1,
                status="planning",
            )

            db.add_all([project1, project2])
            db.commit()
            print("✅ Projects seeded")
        else:
            project1 = db.query(Project).filter_by(name="Comedor Comunitario").first()
            project2 = db.query(Project).filter_by(name="Campaña Escolar").first()

        if not db.query(Task).first():
            task1 = Task(
                title="Compra de alimentos",
                start_date=date(2025, 1, 2),
                end_date=date(2025, 1, 10),
                necessity="Se necesitan alimentos no perecederos para 50 familias.",
                resolves_by_itself=False,
                ong_that_solves=None,
                project=project1,
            )

            task2 = Task(
                title="Recolección de útiles",
                start_date=date(2025, 2, 2),
                end_date=date(2025, 2, 28),
                necessity="Reunir mochilas, cuadernos y lápices.",
                resolves_by_itself=False,
                ong_that_solves=None,
                project=project2,
            )

            task3 = Task(
                title="Entrega de útiles",
                start_date=date(2025, 3, 1),
                end_date=date(2025, 3, 10),
                necessity="Distribuir los útiles en 3 escuelas.",
                resolves_by_itself=True,
                ong_that_solves=None,
                project=project2,
            )

            db.add_all([task1, task2, task3])
            db.commit()
            print("✅ Tasks seeded")

    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_database()
    run_seeds()