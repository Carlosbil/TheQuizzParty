import datetime
from flask import Flask, jsonify, request
from flask_socketio import SocketIO, join_room, leave_room, emit
import json, random
from flask_cors import CORS
import os
import base64
from dataBase import session, User, Score, Questionary, Room
from tinkers import generate_questions
from bcrypt import hashpw, gensalt, checkpw
from socketio_handler import join_game, leave_game, handle_message, on_join
from app import socketio

app = Flask(__name__)
socketio.init_app(app)
CORS(app)

# Enable Cross-Origin Resource Sharing (CORS) for the specified origins
# CORS(app, resources={r"*": {"origins": "http://localhost:3000"}})
CORS(app)

# Construct the file path in a platform-independent manner
file_path = os.path.join('.', 'data', 'questions.json')

from dataBase import session, User

# Especificar el token que quieres buscar/añadir
token_to_add = "test_token|2023-01-01 12:00:00"

# Buscar si ya existe un usuario con ese token
existing_user = session.query(User).filter_by(token=token_to_add).first()

# Si no existe, crear y añadir un nuevo usuario
if not existing_user:
    new_user = User(
        username="nuevo_usuario",
        email="usuario@example.com",
        password="password_seguro",
        name="Nombre Usuario",
        num_preguntas_acertadas=0,
        token=token_to_add,
        image_path="/path/to/image"
    )

    # Añadir la nueva instancia de User a la sesión
    session.add(new_user)

    # Hacer commit de la sesión para guardar el nuevo usuario
    session.commit()

#quiero que se borren y se creen 2 salas cada vez que se inicie el servidor
# Delete all existing rooms
session.query(Room).delete()
session.commit()
room1 = Room(name='Room 1', number_players=0, players=[])
room2 = Room(name='Room 2', number_players=0, players=[])
session.add(room1)
session.add(room2)
session.commit()

# Open the JSON file with explicit encoding and load the questions
# Explicitly specifying the encoding ensures compatibility across different platforms
with open(file_path, 'r', encoding='utf-8') as f:
    questions = json.load(f)

themes = ['history', 'geography', 'sports', 'entertainment', 'literature', 'science', 'pop_culture']

weekly_questions = []


def is_token_valid(token_with_timestamp):
    try:
        # Split the token and timestamp
        token, timestamp_str = token_with_timestamp.split("|")
        timestamp = datetime.datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')

        # Check if the token has expired (more than 24 hours old)
        if (datetime.datetime.now() - timestamp).total_seconds() > 3600 :  # 86400 seconds = 24 hours
            return False
        return True
    except:
        return False


# take a look to the DB for search if the token already exists in another user
def token_exists(token):
    user_with_token = session.query(User).filter_by(token=token).first()
    
    if user_with_token:
        return True
    return False


def generate_token():
    token = base64.urlsafe_b64encode(os.urandom(24)).decode('utf-8')
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    token_with_timestamp = f"{token}|{timestamp}"
    while token_exists(token_with_timestamp):
        token = base64.urlsafe_b64encode(os.urandom(24)).decode('utf-8')
        token_with_timestamp = f"{token}|{timestamp}"
    return token_with_timestamp


"""
______________API____________________

"""
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
        data["token"] = generate_token()
        hashed_password = hashpw(data["password"].encode('utf-8'), gensalt())
        data["password"] = hashed_password.decode('utf-8')
        data["image_path"] = "avatar1"
        user = User(**data)
        session.add(user)
        session.commit()
        info = {
            'message': 'User signed up properly', 
            "token": data["token"], 
            "image_path": "avatar1"
            }
        return jsonify(info), 200 
    
    except Exception as e:
        # roll back if error
        session.rollback()
        message = "Error while creating the user"
        print(f"{message}: {e}")
        return jsonify({'message': message, 'error': str(e)}), 500
    finally:
        # Close session
        session.close()
    
@app.route('/api/logIn', methods=['POST'])
def login_user():
    try:
        data = request.get_json()
        
        # Search user
        user = session.query(User).filter_by(username=data["username"]).first()
        print()
        print(user)
        print()
        # if dont return eror 
        if not user or not checkpw(data["password"].encode('utf-8'), user.password.encode('utf-8')):
            return jsonify({'message': 'Invalid username or password'}), 401
        if not is_token_valid(user.token):
            print("generating token")
            token = generate_token()
            user.token = token
            print(user.token)
            session.commit()
        else:
            print("using the old token")
            token = user.token
            print(token)
        
        info = {
            'message': 'User logged in properly', 
            "token": token, 
            "image_path": user.image_path
            }
        return jsonify(info), 200 

    except Exception as e:
        # roll back if error
        session.rollback()
        message = "Error while logging in"
        print(f"{message}: {e}")
        return jsonify({'message': message, 'error': str(e)}), 500

    finally:
        # Close Session
        session.close()

@app.route('/api/profile', methods=['GET'])
def get_user():
    try:
        data = request.args.get("data")

        # Search user
        user = session.query(User).filter_by(token=data).first()
        if user:
            user_data = {
                "name": user.name,
                "username": user.username,
                "email": user.email,
                "password": user.password,
                "image_path": user.image_path
            }
            return jsonify(user_data), 200 
        else:
            return jsonify({'error': " user not found"}), 404
        
    except Exception as e:
        # roll back if error
        session.rollback()
        message = "Error while getting the user information"
        print(f"{message}: {e}")
        return jsonify({'message': str(e), 'error': message}), 500

    finally:
        # Close session
        session.close()


#in future, automatice to restart the questions everyweek
@app.route('/api/tinker', methods=['GET'])
def get_weekly_questions():
    try:
    # get the 20 questions if there is none
        quest = weekly_questions
        if quest == []:
            quest = generate_questions(10, "random")
        return jsonify({"questions": quest}), 200
    except Exception as e:
        message = "Error while getting questions"
        print(f"{message}: {e}")
        return jsonify({'message': str(e), 'error': message}), 500
       
        
@app.route('/api/tinkerScore', methods=['POST'])       
def save_score():
    """
    Save the score of a user in the database.

    Returns:
    - If the score is saved successfully, returns a JSON object with a 'message' key and a 200 status code.
    - If the token or score is invalid, returns a JSON object with an 'error' key and a 401 status code.
    - If there is an error while saving the score, returns a JSON object with a 'message' and an 'error' key and a 500 status code.
    """
    try:
        data = request.get_json()
        user = session.query(User).filter_by(token=data["token"]).first()
        if user:
            existing_score = session.query(Score).filter_by(username=user.username).first()
            # if the user has an score, update it, else save it
            if existing_score:
                existing_score.score = data["score"]
                existing_score.time_taken = data["time_taken"]
                existing_score.correct_questions = data["correct_questions"]
            else:
                score_data = {
                    "username": user.username,
                    "score": data["score"],
                    "time_taken": data["time_taken"],
                    "correct_questions": data["correct_questions"]
                }
                new_score = Score(**score_data)
                session.add(new_score)
            
            session.commit()      
            
        # if dont return eror 
        if not user:
            session.rollback()
            return jsonify({'error': 'Invalid token or score'}), 401
    
        return jsonify({'message': 'Score saved successfully'}), 200

    except Exception as e:
        # roll back if error
        session.rollback()
        message = "Error while saving score"
        print(f"{message}: {e}")
        return jsonify({'message': str(e), 'error': message}), 500

    finally:
        # Close session
        session.close()
        
        
@app.route('/api/getAllScores', methods=['GET'])
def get_all_scores():
    try:
        scores = session.query(Score).order_by(
                    Score.score.desc(),
                    Score.correct_questions.desc(),
                    Score.time_taken.asc()
                ).all()

        score_list = [{"name": score.username, "score": score.score, "time_taken": score.time_taken, "correct_questions": score.correct_questions} for score in scores]
        return jsonify(score_list), 200
    
    except Exception as e:
        # roll back if error
        session.rollback()
        message = "Error while saving score"
        print(f"{message}: {e}")
        return jsonify({'message': str(e), 'error': message}), 500
    
    finally:
        # Close session
        session.close()         
        
@app.route('/api/updateProfile', methods=['PUT'])
def update_profile():
    try:
        data = request.get_json()
        user = session.query(User).filter_by(token=data["token"]).first()
        hashed_password = hashpw(data["password"].encode('utf-8'), gensalt())
        data["password"] = hashed_password.decode('utf-8')
        print(data)
        if user:
            user.username = data["username"]
            user.name = data["name"]
            user.email = data["email"]
            user.password = data["password"]
            session.commit()
            return jsonify(data), 200
        else:
            return jsonify({'message': "not existing profile", 'error': "the user could not be found"}), 500
        
    except Exception as e:
        # roll back if error
        session.rollback()
        message = "Error while saving the information"
        print(f"{message}: {e}")
        return jsonify({'message': message, 'error': message}), 500
    
    finally:
        # Close session
        session.close() 
        
        
@app.route('/api/updateAvatar', methods=['PUT'])
def update_avatar():
    try:
        data = request.get_json()
        user = session.query(User).filter_by(token=data["token"]).first()
        print(data)
        if user:
            user.image_path = data["image_path"]
            session.commit()
            return jsonify(data), 200
        else:
            return jsonify({'message': "not existing profile", 'error': "the user could not be found"}), 500
        
    except Exception as e:
        # roll back if error
        session.rollback()
        message = "Error while saving the information"
        print(f"{message}: {e}")
        return jsonify({'message': message, 'error': message}), 500
    
    finally:
        # Close session
        session.close() 
        
@app.route('/api/addQuestionary', methods=['POST'])
def add_questionary():
    try:
        data = request.get_json()
        user = session.query(User).filter_by(token=data["token"]).first()
        print(data)
        if user:
            questionary_data = {
                "interface": int(data["interface"]),
                "ez2use": int(data["ez2use"]),
                "questions": int(data["questions"]),
                "functionality": data["functionality"],
                "delete": data["delete"]
            }
            new_questionary = Questionary(**questionary_data)
            session.add(new_questionary)
            
            session.commit() 
            info = {
                'message': 'Questionary saved, Thanks!', 
            }
            return jsonify(info), 200 
        else:
            return jsonify({'message': "not existing profile", 'error': "the user could not be found"}), 500
        
    except Exception as e:
        # roll back if error
        session.rollback()
        message = "Error while saving the information"
        print(f"{message}: {e}")
        return jsonify({'message': message, 'error': message}), 500
    
    finally:
        # Close session
        session.close() 
        
if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=3001, debug=True)
           
# Run the Flask app with the specified configuration
# The configuration (host, port, debug) can be adjusted as needed or made configurable
# if __name__ == "__main__":
#     app.run(host='0.0.0.0', port=3001, debug=True)
