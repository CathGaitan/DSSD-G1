from sqlalchemy import Table, Column, ForeignKey, Integer
from app.core.database import Base

user_ongs = Table(
    'user_ongs',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('ong_id', Integer, ForeignKey('ongs.id'), primary_key=True)
)