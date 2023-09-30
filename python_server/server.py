from flask import Flask, jsonify, request
import json, random
from flask_cors import CORS
import os
from dataBase import session, User
app = Flask(__name__)

# Enable Cross-Origin Resource Sharing (CORS) for the specified origins
CORS(app, resources={r"/api/questions": {"origins": "http://localhost:3000"}})

# Construct the file path in a platform-independent manner
file_path = os.path.join('.', 'data', 'questions.json')

# Open the JSON file with explicit encoding and load the questions
# Explicitly specifying the encoding ensures compatibility across different platforms
with open(file_path, 'r', encoding='utf-8') as f:
    questions = json.load(f)

themes = ['history', 'geography', 'sports', 'entertainment', 'literature', 'science', 'pop_culture']



# Define a route to handle GET requests and return questions in JSON format
@app.route('/api/questions', methods=['GET'])
def obtener_datos():
    try:
        # Retrieve the requested theme from query parameters
        quest = request.args.get("data")
        # Check if the requested theme exists in the loaded questions
        if quest and quest in questions:
            # Select a random question from the specified theme and return it as JSON
            number = random.randint(0, len(questions[quest])-1)
            return jsonify(questions[quest][number])
        elif quest == "random":
            theme = random.randint(0, len(themes)-1) 
            number = random.randint(0, len(questions[themes[theme]])-1)
            return jsonify(questions[themes[theme]][number])
        elif quest:   
            # Return an error response if the specified theme does not exist
            return jsonify({"error": f"the category {quest} didn't exist in the server"}), 404
    except Exception as e:
        return jsonify({'message': 'Error en el servidor', 'error': str(e)}), 500


@app.route('/api/createUser', methods=['POST'])
def create_user():
    try:
    # Añadir el nuevo usuario a la sesión y comprometer
        data = request.get_json()
        """{
            "username": "bdp",
            "email": "carlosbilbao2@gmail.com",
            "password": "1234",
            "nombre": "Carlos Bilbao",
            "num_preguntas_acertadas":1
        }"""
        data["token"] = "1232131123231223"
        print(data)
        user = User(**data)
        session.add(user)
        session.commit()
        print("Usuario creado exitosamente!")
        return jsonify({'message': 'User Created properly'}), 200 
    
    except Exception as e:
        # Si ocurre un error, hacer rollback de la sesión
        session.rollback()
        print(f"Error al crear el usuario: {e}")
        return jsonify({'message': 'Error en el servidor', 'error': str(e)}), 500

    finally:
        # Cerrar la sesión
        session.close()
    
# Run the Flask app with the specified configuration
# The configuration (host, port, debug) can be adjusted as needed or made configurable
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3001, debug=True)
