from datetime import datetime
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String, Sequence, ForeignKey, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import os
from sqlalchemy.dialects.postgresql import ARRAY

Base = declarative_base()


"""
-----------------
USER TABLE
_________________
"""
class User(Base):
    __tablename__ = 'usuarios'
    id = Column(Integer, Sequence('usuario_id_seq'), primary_key=True)
    username = Column(String(50), unique=True)
    email = Column(String(100))
    password = Column(String(255))
    name = Column(String(255))
    num_preguntas_acertadas = Column(Integer)
    token = Column(String)
    image_path = Column(String(100))  # Path to user's image

    
load_dotenv()
"""
-----------------
TINKER SCORE TABLE
_________________
"""
class Score(Base):
    __tablename__ = 'scores'
    
    score_id = Column(Integer, Sequence('score_id_seq'), primary_key=True)
    username = Column(String(50), ForeignKey('usuarios.username'))
    score = Column(Float)
    time_taken = Column(Integer)
    correct_questions = Column(Integer)

    # Relación con la tabla usuarios
    user = relationship("User", back_populates="scores")

"""
-----------------
QUESTIONARY TABLE
_________________
"""
class Questionary(Base):
    __tablename__ = 'questionary_1'
    
    quest_id = Column(Integer, Sequence('questionary_1_id_seq'), primary_key=True)
    interface = Column(Integer)
    ez2use= Column(Integer)
    questions = Column(Integer)
    functionality = Column(String)
    delete = Column(String)


"""
-----------------
ROOMS TABLE
_________________
"""
class Room(Base):
    __tablename__ = 'rooms'
    id = Column(Integer, Sequence('room_id_seq'), primary_key=True)
    name = Column(String(50), unique=True)
    is_occupied = Column(Boolean, default=False)
    number_players = Column(Integer)
    players = Column(ARRAY(String))
    
DATABASE_URL = os.getenv("DATABASE_URL")

User.scores = relationship("Score", order_by=Score.score_id, back_populates="user")

def init_db():
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    return session


# Inicializa la base de datos al cargar el módulo
session = init_db()
