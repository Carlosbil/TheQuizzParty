from datetime import datetime
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String, Sequence, ForeignKey, Float, Boolean, JSON
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
    username = Column(String(50), ForeignKey('usuarios.username', onupdate="CASCADE"))

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


"""
-----------------
Results TABLE
_________________
"""
#themes = ['history', 'geography', 'sports', 'entertainment', 'literature', 'science', 'pop_culture']

class Results(Base):
    __tablename__ = 'results'
    username = Column(String(50), ForeignKey('usuarios.username', onupdate="CASCADE"), primary_key=True)
    history_accerted = Column(Integer, default=0)
    history_wrong = Column(Integer, default=0)
    geography_accerted = Column(Integer, default=0)
    geography_wrong = Column(Integer, default=0)
    sports_accerted = Column(Integer, default=0)
    sports_wrong = Column(Integer, default=0)
    entertainment_accerted = Column(Integer, default=0)
    entertainment_wrong = Column(Integer, default=0)
    literature_accerted = Column(Integer, default=0)
    literature_wrong = Column(Integer, default=0)
    science_accerted = Column(Integer, default=0)
    science_wrong = Column(Integer, default=0)
    pop_culture_accerted = Column(Integer, default=0)
    pop_culture_wrong = Column(Integer, default=0)

"""
-----------------
Results TABLE
_________________
"""
#themes = ['history', 'geography', 'sports', 'entertainment', 'literature', 'science', 'pop_culture']

class Tinkers(Base):
    __tablename__ = 'tinkers'
    week = Column(Integer, Sequence('week'), primary_key=True)
    questions = Column(JSON)
    date = Column(Integer)
    
    
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