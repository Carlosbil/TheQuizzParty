from flask import Flask, jsonify, request
import json, random
import os
from dataBase import Tinkers, get_session
import datetime as datetime
import logging

logging.basicConfig(filename="./my_app.log", filemode="w", format="%(name)s - %(levelname)s - %(message)s", level=logging.DEBUG)

# in the future, implement a weekly function that clean questions value... 
questions = []

themes = ["history", "geography", "sports", "entertainment", "literature", "science", "pop_culture"]

# Obtén la ruta absoluta del directorio del script actual
dir_path = os.path.dirname(os.path.realpath(__file__))

# Construye la ruta del archivo de una manera independiente de la plataforma
file_path = os.path.join(dir_path, "data", "questions.json")
# Open the JSON file with explicit encoding and load the questions
# Explicitly specifying the encoding ensures compatibility across different platforms
with open(file_path, "r", encoding="utf-8") as f:
    questions = json.load(f)

def get_random_theme():
    return random.choice(themes)
def get_weekly_questions():
    week = datetime.date.today().isocalendar()[1]
    session = get_session()
    tinkers = session.query(Tinkers).filter_by(week=week).first()

    if not tinkers:
        logging.debug("Generating weekly questions")
        questions = generate_questions(10, "random")

        tinkers = Tinkers(week=week, questions=questions, date=datetime.date.today().year)
        session.add(tinkers)
        session.commit()
    else:
        logging.debug("Questions Found")

    session.close()
    return tinkers.questions if tinkers else None



def generate_questions(number, theme):
    quests = []
    for x in range(0, number):
        if theme and theme in questions:
            # Select a random question from the specified theme and return it as JSON
            number = random.randint(0, len(questions[theme])-1)
            one_question = questions[theme][number]
        elif theme == "random":
            number = random.randint(0, len(themes)-1) 
            question = random.randint(0, len(questions[themes[number]])-1)
            one_question = questions[themes[number]][question]
        while one_question in quests:
            if theme and theme in questions:
                # Select a random question from the specified theme and return it as JSON
                number = random.randint(0, len(questions[theme])-1)
                one_question = questions[theme][number]
            elif theme == "random":
                number = random.randint(0, len(themes)-1) 
                question = random.randint(0, len(questions[themes[number]])-1)
                one_question = questions[themes[number]][question]
        quests.append(one_question)
        
    return quests

QUESTION_MAP = {
    "history": ["history_accerted", "history_wrong"],
    "geography": ["geography_accerted", "geography_wrong"],
    "sports": ["sports_accerted", "sports_wrong"],
    "entertainment": ["entertainment_accerted", "entertainment_wrong"],
    "literature": ["literature_accerted", "literature_wrong"],
    "science": ["science_accerted", "science_wrong"],
    "pop_culture": ["pop_culture_accerted", "pop_culture_wrong"]
}