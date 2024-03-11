from dataBase import Score, Results, get_session
from sqlalchemy import func

# to get the total of 
total_accerted = func.sum(
    Results.history_accerted +
    Results.geography_accerted +
    Results.sports_accerted +
    Results.entertainment_accerted +
    Results.literature_accerted +
    Results.science_accerted +
    Results.pop_culture_accerted
).label('total_accerted')

def zeus_100(user):
    session = get_session()
    query = session.query(
        Results.username,
        total_accerted
    ).having(
        total_accerted >= 100
    ).group_by(
        Results.username
    )
    # Ejecuta la consulta
    results = query.all()
    
    return True
