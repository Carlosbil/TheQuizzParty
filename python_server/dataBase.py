from sqlalchemy import create_engine, Column, Integer, String, Sequence
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class Usuario(Base):
    __tablename__ = 'usuarios'
    id = Column(Integer, Sequence('usuario_id_seq'), primary_key=True)
    username = Column(String(50))
    email = Column(String(100))
    password = Column(String(50))
    nombre = Column(String(100))
    num_preguntas_acertadas = Column(Integer)

DATABASE_URL = "postgresql://bsp:password@localhost/dbname"

def init_db():
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    return session

# Inicializa la base de datos al cargar el módulo
session = init_db()
