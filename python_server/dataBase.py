from datetime import datetime
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String, Sequence, ForeignKey, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import os

Base = declarative_base()

class User(Base):
    __tablename__ = 'usuarios'
    id = Column(Integer, Sequence('usuario_id_seq'), primary_key=True)
    username = Column(String(50), unique=True)
    email = Column(String(100))
    password = Column(String(50))
    name = Column(String(100))
    num_preguntas_acertadas = Column(Integer)
    token = Column(String)
    
load_dotenv()

class Score(Base):
    __tablename__ = 'scores'
    
    score_id = Column(Integer, Sequence('score_id_seq'), primary_key=True)
    username = Column(String(50), ForeignKey('usuarios.username'))
    score = Column(Float)
    time_taken = Column(Integer)
    correct_questions = Column(Integer)

    # Relación con la tabla usuarios
    user = relationship("User", back_populates="scores")
    
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
