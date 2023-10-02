from flask import Flask, jsonify, request
import json, random
import os
from dataBase import session, User

# in the future, implement a weekly function that clean questions value... 
questions = []

themes = ['history', 'geography', 'sports', 'entertainment', 'literature', 'science', 'pop_culture']
# Construct the file path in a platform-independent manner
file_path = os.path.join('.', 'data', 'questions.json')

# Open the JSON file with explicit encoding and load the questions
# Explicitly specifying the encoding ensures compatibility across different platforms
with open(file_path, 'r', encoding='utf-8') as f:
    questions = json.load(f)
    

def generate_questions(number, theme):
    quests = []
    for x in range(0, number):
        if theme and theme in questions:
            # Select a random question from the specified theme and return it as JSON
            number = random.randint(0, len(questions[theme])-1)
            quests.append(questions[theme][number])
        elif theme == "random":
            print("RAAANDOM")
            print(theme)
            number = random.randint(0, len(themes)-1) 
            question = random.randint(0, len(questions[themes[number]])-1)
            quests.append(questions[themes[number]][question])
    return quests