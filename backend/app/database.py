from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from os import getenv

URL_DATABASE = getenv("URL_DATABASE")