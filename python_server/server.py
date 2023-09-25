from flask import Flask, jsonify, request
import json, random
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/questions": {"origins": "http://localhost:3000"}})

with open('./data/questions.json', 'r') as f:
    questions = json.load(f)
themes = ['history', 'geography']

# Ruta GET que devuelve un diccionario en formato JSON
@app.route('/api/questions', methods=['GET'])
def obtener_datos():
    try:
        
        quest = request.args.get("data")
        if quest and quest in questions:
            number = random.randint(0, len(questions[quest]))
            return jsonify(questions[quest][number])
        elif quest:
            return jsonify({"error": f"the category {quest} didn't exist in the server"}), 404

    except Exception as e:
        return jsonify({'message': 'Error en el servidor', 'error': str(e)})
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3001, debug=True)


