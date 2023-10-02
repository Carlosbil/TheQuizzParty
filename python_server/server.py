from flask import Flask, jsonify, request
import json, random
from flask_cors import CORS
import os
from dataBase import session, User
from tinkers import generate_questions
app = Flask(__name__)

# Enable Cross-Origin Resource Sharing (CORS) for the specified origins
CORS(app, resources={r"*": {"origins": "http://localhost:3000"}})

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
        if quest not in themes and quest != "random":   
            # Return an error response if the specified theme does not exist
            return jsonify({"error": f"the category {quest} didn't exist in the server"}), 404
        question = generate_questions(1,quest)[0]
        return jsonify(question), 200
    except Exception as e:
        return jsonify({'message': 'Error en el servidor', 'error': str(e)}), 500


@app.route('/api/createUser', methods=['POST'])
def create_user():
    try:
    # Add new user
        data = request.get_json()
        data["token"] = "1232131123231223"
        print(data)
        user = User(**data)
        session.add(user)
        session.commit()
        print("Usuario creado exitosamente!")
        return jsonify({'message': 'User Created properly'}), 200 
    
    except Exception as e:
        # roll back if error
        session.rollback()
        print(f"Error al crear el usuario: {e}")
        return jsonify({'message': 'Error en el servidor', 'error': str(e)}), 500

    finally:
        # Cerrar la sesión
        session.close()
    
@app.route('/api/logIn', methods=['POST'])
def login_user():
    try:
        data = request.get_json()
        
        # Search user
        user = session.query(User).filter_by(username=data["username"]).first()

        # if dont return eror 
        if not user or user.password != data["password"]:
            return jsonify({'message': 'Invalid username or password'}), 401
        
        return jsonify({'message': 'User logged in properly'}), 200 

    except Exception as e:
        # roll back if error
        session.rollback()
        print(f"Error during login: {e}")
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

    finally:
        # Cerrar la sesión de la base de datos
        session.close()

@app.route('/api/profile', methods=['GET'])
def get_user():
    try:
        print()
        data = request.args.get("data")
        print(data)
        # Search user
        user = session.query(User).filter_by(username=data).first()
        if user:
            user_data = {
                "name": user.name,
                "username": user.username,
                "email": user.email,
                "password": user.password
            }
            return jsonify(user_data), 200 

    except Exception as e:
        # roll back if error
        session.rollback()
        print(f"Error during login: {e}")
        return jsonify({'message': 'Server error', 'error': str(e)}), 500

    finally:
        # Cerrar la sesión de la base de datos
        session.close()

@app.route('/api/tinker', methods=['GET'])
def get_weekly_questions():
    try:
    # Add new user
        if questions == []:
            return
        
    except Exception as e:
        # roll back if error
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
