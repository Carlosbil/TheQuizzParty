import datetime
from flask import Flask, jsonify, request
import json, random
from flask_cors import CORS
import os
import base64
from dataBase import session, User, Score
from tinkers import generate_questions
app = Flask(__name__)

# Enable Cross-Origin Resource Sharing (CORS) for the specified origins
# CORS(app, resources={r"*": {"origins": "http://localhost:3000"}})
CORS(app)

# Construct the file path in a platform-independent manner
file_path = os.path.join('.', 'data', 'questions.json')

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
        if (datetime.datetime.now() - timestamp).total_seconds() > 86400:  # 86400 seconds = 24 hours
            return False
        return True
    except:
        return False

def generate_token():
    return base64.urlsafe_b64encode(os.urandom(24)).decode('utf-8')

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
        data["token"] = modified_generate_token()
        user = User(**data)
        session.add(user)
        session.commit()
        return jsonify({'message': 'User Created properly'}), 200 
    
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
        # if dont return eror 
        if not user or user.password != data["password"]:
            return jsonify({'message': 'Invalid username or password'}), 401
        
        token = generate_token()
        return jsonify({'message': 'User logged in properly', "token": token}), 200 

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
        else:
            return jsonify({'message': " user not found", 'error': str(e)}), 404
        
    except Exception as e:
        # roll back if error
        session.rollback()
        message = "Error while getting the user information"
        print(f"{message}: {e}")
        return jsonify({'message': message, 'error': str(e)}), 500

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
        print()
        print()
        print(quest)
        return jsonify({"questions": quest}), 200
    except Exception as e:
        message = "Error while getting questions"
        print(f"{message}: {e}")
        return jsonify({'message': message, 'error': str(e)}), 500
       
        
@app.route('/api/tinkerScore', methods=['POST'])       
def save_score():
    try:
        data = request.get_json()
        
        score = Score(**data)
        session.add(score)
        session.commit()
        # if dont return eror 
        if not score:
            session.rollback()
            return jsonify({'message': 'Invalid username or password'}), 401
        
        return jsonify({'message': 'User logged in properly'}), 200 

    except Exception as e:
        # roll back if error
        session.rollback()
        message = "Error while saving score"
        print(f"{message}: {e}")
        return jsonify({'message': message, 'error': str(e)}), 500

    finally:
        # Close session
        session.close()         
        
        
# Run the Flask app with the specified configuration
# The configuration (host, port, debug) can be adjusted as needed or made configurable
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3001, debug=True)
