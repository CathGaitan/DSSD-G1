from sqlalchemy.orm import Session
from app.models.user_ong import user_ongs

class UserOngRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_association(self, user_id: int, ong_id: int):
        query = self.db.execute(
            user_ongs.select().where(
                (user_ongs.c.user_id == user_id) &
                (user_ongs.c.ong_id == ong_id)
            )
        )
        return query.fetchone()

    def create_association(self, user_id: int, ong_id: int):
        self.db.execute(user_ongs.insert().values(user_id=user_id, ong_id=ong_id))
        self.db.commit()

    def delete_association(self, user_id: int, ong_id: int):
        self.db.execute(
            user_ongs.delete().where(
                (user_ongs.c.user_id == user_id) &
                (user_ongs.c.ong_id == ong_id)
            )
        )
        self.db.commit()