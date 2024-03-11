import logging
from achievements import *
from sqlalchemy.sql import func
from dataBase import Results
from collections import defaultdict

logging.basicConfig(filename="./my_app.log", filemode="w", format="%(name)s - %(levelname)s - %(message)s", level=logging.DEBUG)
aciertos_por_usuario = defaultdict(int)


def accerted_by_category(categoria_accerted):
    session = get_session()
    return session.query(
        Results.username,
        func.sum(categoria_accerted).label('suma_accerted')
    ).group_by(Results.username).all()

def sumar_aciertos(lista_aciertos):
    for username, suma_accerted in lista_aciertos:
        aciertos_por_usuario[username] += suma_accerted

def unlock_zeus_trophies(user):
    logging.warning(user)
    unlocked = []
    
    history_accerted = accerted_by_category(Results.history_accerted)
    geography_accerted = accerted_by_category(Results.geography_accerted)
    sports_accerted = accerted_by_category(Results.sports_accerted)
    entertainment_accerted = accerted_by_category(Results.entertainment_accerted)
    literature_accerted = accerted_by_category(Results.literature_accerted)
    science_accerted = accerted_by_category(Results.science_accerted)
    pop_culture_accerted = accerted_by_category(Results.pop_culture_accerted)
    
    for achiv in ZEUS_MAP:
        unlocked.append({achiv:ZEUS_MAP[achiv](user)})
    return unlocked

def unlock_athenea_trophies(user):
    return [2]

def unlock_hermes_trophies(user):
    return [3]

def unlock_dionysus_trophies(user):
    return [4]

def unlock_ares_trophies(user):
    return[5]

def unlock_godofgods_trophies(user):
    return [6]

def unlock_hermes_trophies(username):
    return [7]


ZEUS_MAP = {
    "100": zeus_100,
    "101": zeus_101,
    "102": zeus_102,
}