from flask import Flask, jsonify
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

CORS(app, resources={r"/questions": {"origins": "http://localhost:3000"}})

with open('./data/questions.json', 'r') as f:
    questions = json.load(f)
themes = ['history', 'geography']

# Ruta GET que devuelve un diccionario en formato JSON
@app.route('/questions', methods=['GET'])
def obtener_datos():
    return jsonify(questions['history'])


if __name__ == '__main__':
    app.run(debug=True)
