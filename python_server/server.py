from flask import Flask, jsonify
import json
with open('questions.json', 'r') as file:
    questions = json.load(file)
    
app = Flask(__name__)

themes = ['history', 'geography']
# Ruta GET que devuelve un diccionario en formato JSON
@app.route('/questions', methods=['GET'])
def obtener_datos():
    return jsonify(questions['geography'])


if __name__ == '__main__':
    app.run(debug=True)
