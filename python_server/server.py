import datetime
from flask import Flask, jsonify, request
from flask_socketio import SocketIO, join_room, leave_room, emit
import json, random
from flask_cors import CORS
import logging
import os
import base64
from  dataBase import User, Score, Questionary, Room, Results
from  tinkers import generate_questions, get_weekly_questions
from  bcrypt import hashpw, gensalt, checkpw
from  socketio_handler import QUESTION_MAP
from  app import socketio
from  dataBase import User, get_session
from  to_unlock import achiv_user

app = Flask(__name__)
socketio.init_app(app)
# Enable Cross-Origin Resource Sharing (CORS) for the specified origins
# CORS(app, resources={r"*": {"origins": "http://localhost:3000"}})
CORS(app)

logging.basicConfig(filename="./my_app.log", filemode="w", format="%(name)s - %(levelname)s - %(message)s", level=logging.DEBUG)

# Construct the file path in a platform-independent manner
dir_path = os.path.dirname(os.path.realpath(__file__))
file_path = os.path.join(dir_path, "data", "questions.json")
unlock_path = os.path.join(dir_path, "data", "to_unlock.json")

# Delete all existing rooms
session = get_session()
session.query(Room).delete()
session.close()
# Open the JSON file with explicit encoding and load the questions
# Explicitly specifying the encoding ensures compatibility across different platforms
with open(file_path, "r", encoding="utf-8") as f:
    questions = json.load(f)

with open(unlock_path,"r", encoding="utf-8") as f:
    unlockable = json.load(f)
    
themes = ["history", "geography", "sports", "entertainment", "literature", "science", "pop_culture"]


def is_token_valid(token_with_timestamp):
    try:
        # Split the token and timestamp
        token, timestamp_str = token_with_timestamp.split("|")
        timestamp = datetime.datetime.strptime(timestamp_str, "%Y-%m-%d %H:%M:%S")

        # Check if the token has expired (more than 24 hours old)
        if (datetime.datetime.now() - timestamp).total_seconds() > 7200 :  # 86400 seconds = 24 hours
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
    token = base64.urlsafe_b64encode(os.urandom(24)).decode("utf-8")
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    token_with_timestamp = f"{token}|{timestamp}"
    while token_exists(token_with_timestamp):
        token = base64.urlsafe_b64encode(os.urandom(24)).decode("utf-8")
        token_with_timestamp = f"{token}|{timestamp}"
    return token_with_timestamp


"""
______________API____________________

"""
# Define a route to handle GET requests and return questions in JSON format
@app.route("/api/questions", methods=["GET"])
def obtener_datos():
    try:
        # Retrieve the requested theme from query parameters
        logging.info("Getting questions")
        quest = request.args.get("data")
        # Check if the requested theme exists in the loaded questions
        if quest not in themes and quest != "random":   
            # Return an error response if the specified theme does not exist
            logging.debug({"error": f"the category {quest} didn't exist in the server"})
            return jsonify({"error": f"the category {quest} didn't exist in the server"}), 404
        question = generate_questions(1,quest)[0]
        return jsonify(question), 200
    except Exception as e:
        logging.error({"error": f"server error {e} "})
        return jsonify({"message": "Error en el servidor", "error": str(e)}), 500


@app.route("/api/createUser", methods=["POST"])
def create_user():
    try:
    # Add new user
        session = get_session()
        logging.info("Creating User")
        data = request.get_json()
        data["token"] = generate_token()
        hashed_password = hashpw(data["password"].encode("utf-8"), gensalt())
        data["password"] = hashed_password.decode("utf-8")
        data["image_path"] = "avatar1"
        user = User(**data)
        session.add(user)
        session.commit()
        info = {
            "message": "User signed up properly", 
            "token": data["token"], 
            "image_path": "avatar1",
            "username":user.username
            }
        logging.info(f"User created {info}")
        return jsonify(info), 200 
    
    except Exception as e:
        # roll back if error
        session.rollback()
        message = "Error while creating the user"
        logging.error(f"{message}: {e}")
        return jsonify({"message": message, "error": str(e)}), 500
    finally:
        # Close session
        session.close()
    
@app.route("/api/logIn", methods=["POST"])
def login_user():
    try:
        session = get_session()
        logging.info(f"User logging")
        data = request.get_json()
        
        # Search user
        user = session.query(User).filter_by(username=data["username"]).first()
        print()
        print(user)
        print()
        # if dont return eror 
        if not user or not checkpw(data["password"].encode("utf-8"), user.password.encode("utf-8")):
            return jsonify({"message": "Invalid username or password"}), 401
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
            "message": "User logged in properly", 
            "token": token, 
            "image_path": user.image_path,
            "username":user.username
            }
        logging.info(f"User Logged {info}")
        return jsonify(info), 200 

    except Exception as e:
        # roll back if error
        session.rollback()
        message = "Error while logging in"
        logging.error(f"{message}: {e}")
        return jsonify({"message": message, "error": str(e)}), 500

    finally:
        # Close Session
        session.close()


#in future, automatice to restart the questions everyweek
@app.route("/api/tinker", methods=["GET"])
def get_week_questions():
    try:
    # get the 20 questions if there is none
        logging.debug("Getting questions")
        quest = get_weekly_questions()
        return jsonify({"questions": quest}), 200
    except Exception as e:
        message = "Error while getting questions"
        logging.error(f"{message}: {e}")
        return jsonify({"message": str(e), "error": message}), 500
       
        
@app.route("/api/tinkerScore", methods=["POST"])       
def save_score():
    """
    Save the score of a user in the database.

    Returns:
    - If the score is saved successfully, returns a JSON object with a "message" key and a 200 status code.
    - If the token or score is invalid, returns a JSON object with an "error" key and a 401 status code.
    - If there is an error while saving the score, returns a JSON object with a "message" and an "error" key and a 500 status code.
    """
    try:
        logging.info("Saving Tinkers Score")
        session = get_session()
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
                 
        logging.info("Saved Tinkers Score")
        # if dont return eror 
        if not user:
            session.rollback()
            return jsonify({"error": "Invalid token or score"}), 401
    
        return jsonify({"message": "Score saved successfully"}), 200

    except Exception as e:
        # roll back if error
        session.rollback()
        message = "Error while saving score"
        logging.error(f"{message}: {e}")
        return jsonify({"message": str(e), "error": message}), 500

    finally:
        # Close session
        session.close()
        
        
@app.route("/api/getAllScores", methods=["GET"])
def get_all_scores():
    try:
        logging.info("Getting all Tinkers Score")
        session = get_session()
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
        logging.error(f"{message}: {e}")
        return jsonify({"message": str(e), "error": message}), 500
    
    finally:
        # Close session
        session.close()         
        
@app.route("/api/updateProfile", methods=["PUT"])
def update_profile():
    try:
        session = get_session()
        logging.info(f"Updating profile")
        data = request.get_json()
        user = session.query(User).filter_by(token=data["token"]).first()
        if data.get("password"):
            logging.warning("Changing password...")
            hashed_password = hashpw(data["password"].encode("utf-8"), gensalt())
            data["password"] = hashed_password.decode("utf-8")
        print(data)
        if user:
            user.username = data["username"]
            user.name = data["name"]
            user.email = data["email"]
            if data.get("password"):
                user.password = data["password"]
            session.commit()
            logging.info(f"User updated {data}")
            return jsonify(data), 200
        else:
            return jsonify({"message": "not existing profile", "error": "the user could not be found"}), 500
        
    except Exception as e:
        # roll back if error
        session.rollback()
        message = "Error while saving the information"
        logging.error(f"{message}: {e}")
        return jsonify({"message": message, "error": message}), 500
    
    finally:
        # Close session
        session.close() 
        
        
@app.route("/api/updateAvatar", methods=["PUT"])
def update_avatar():
    try:
        logging.info("Updating Avatar")
        session = get_session()
        data = request.get_json()
        user = session.query(User).filter_by(token=data["token"]).first()
        print(data)
        if user:
            user.image_path = data["image_path"]
            session.commit()
            return jsonify(data), 200
        else:
            return jsonify({"message": "not existing profile", "error": "the user could not be found"}), 500
        
    except Exception as e:
        # roll back if error
        session.rollback()
        message = "Error while saving the information"
        logging.error(f"{message}: {e}")
        return jsonify({"message": message, "error": message}), 500
    
    finally:
        # Close session
        session.close() 
        
@app.route("/api/addQuestionary", methods=["POST"])
def add_questionary():
    try:
        logging.info("Add questionary response")
        session = get_session()
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
                "message": "Questionary saved, Thanks!", 
            }
            return jsonify(info), 200 
        else:
            return jsonify({"message": "not existing profile", "error": "the user could not be found"}), 500
        
    except Exception as e:
        # roll back if error
        session.rollback()
        message = "Error while saving the information"
        logging.error(f"{message}: {e}")
        return jsonify({"message": message, "error": message}), 500
    
    finally:
        # Close session
        session.close() 
        
        
@app.route("/api/saveQuestions", methods=["POST"])
def save_answers():
    try:
        logging.info("Saving questions response")
        session = get_session()
        # extract the data from the request
        data = request.get_json()
        user = session.query(User).filter_by(token=data["token"]).first()
        theme = data["theme"]
        accerted = data["accerted"]
        # if the user answer correctly, the wrong answer is 0, else 1
        wrong = 0 if accerted == 1 else 1
        if user:
            # if the user has an score, update it, else save it
            existing_score = session.query(Results).filter_by(username=user.username).first()
            if existing_score:
                session.query(Results).filter_by(username=user.username).update({
                    QUESTION_MAP[theme][0]: existing_score.__dict__[QUESTION_MAP[theme][0]] + accerted,
                    QUESTION_MAP[theme][1]: existing_score.__dict__[QUESTION_MAP[theme][1]] + wrong
                })
            else:
                new_results = Results(username=user.username, **{
                    QUESTION_MAP[theme][0]: accerted,
                    QUESTION_MAP[theme][1]: wrong
                })
                session.add(new_results)
            logging.debug(f"Saved question score for user {user.username}")    
            session.commit()
        else:
            logging.error("User not found")
        info = {
                "message": "Questionary saved, Thanks!", 
            }
        return jsonify(info), 200 

    except Exception as e:
        # Roll back if error
        session.rollback()
        message = "Error while saving the information"
        logging.error(f"{message}: {e}")
        return jsonify({"message": message, "error": message}), 500
    
    finally:
        # Close session
        session.close() 


@app.route("/api/getUnlocks", methods=["GET"])
def get_all_unlocks():
    logging.info("Getting achivements")
    return jsonify(unlockable), 200

@app.route("/api/postProfile", methods=["POST"])       
def post_Profile():
    """
    Get profile information

    Returns:
    - If the score is saved successfully, returns a JSON object with a "message" key and a 200 status code.
    - If the token or score is invalid, returns a JSON object with an "error" key and a 401 status code.
    - If there is an error while saving the score, returns a JSON object with a "message" and an "error" key and a 500 status code.
    """
    try:
        session = get_session()
        logging.info("getting profile")
        data = request.get_json()
        user = session.query(User).filter_by(token=data["token"]).first()
        logging.debug(user)
        if user:
            user_data = {
                "name": user.name,
                "username": user.username,
                "email": user.email,
                "password": user.password,
                "image_path": user.image_path
            }
            logging.info(f"User getted {user_data}")
            return jsonify(user_data), 200 
                # if dont return eror 
        else:
            logging.warning(f"User Not found")
            return jsonify({"error": " user not found"}), 404


    except Exception as e:
        # roll back if error
        session.rollback()
        message = "Error while saving score"
        logging.error(f"{message}: {e}")
        return jsonify({"message": str(e), "error": message}), 500

    finally:
        # Close session
        session.close()


@app.route("/api/unlockAchievements", methods=["POST"])       
def post_unlock_achievements():
    """
    Unlock trophies, and return an array with all the id of trophies that has been unlocked

    Returns:
    - If the score is saved successfully, returns a JSON object with a "message" key and a 200 status code.
    - If the token or score is invalid, returns a JSON object with an "error" key and a 401 status code.
    - If there is an error while saving the score, returns a JSON object with a "message" and an "error" key and a 500 status code.
    """
    try:
        session = get_session()
        logging.info("getting profile")
        data = request.get_json()
        user = session.query(User).filter_by(token=data["token"]).first()
        if user:
            unlock_achiv = achiv_user(user)
            unlock_achiv.unlock_all()
            pos = 0
            for god in unlockable:
                pos = 0
                for achiv in unlockable[god]:
                    if achiv["id"] in unlock_achiv.unlocked:
                        unlockable[god][pos]["unlocked"]=True
                    else:
                        unlockable[god][pos]["unlocked"]=False
                    pos +=1
            logging.debug(f"unlocked {unlockable} for user {user}")
            return jsonify(unlockable), 200 
                # if dont return eror 
        else:
            logging.warning(f"User Not found")
            return jsonify({"error": " user not found"}), 404


    except Exception as e:
        # roll back if error
        session.rollback()
        message = "Error while unlocking trophies"
        logging.error(f"{message}: {e}")
        return jsonify({"message": str(e), "error": message}), 500

    finally:
        # Close session
        session.close()
        

@app.route("/api/userStats", methods=["POST"])       
def post_user_stats():
    """
    Get user stats

    Returns:
    - If the score is saved successfully, returns a JSON object with a "message" key and a 200 status code.
    - If the token or score is invalid, returns a JSON object with an "error" key and a 401 status code.
    - If there is an error while saving the score, returns a JSON object with a "message" and an "error" key and a 500 status code.
    """
    try:
        session = get_session()
        logging.info("getting profile")
        data = request.get_json()
        user = session.query(User).filter_by(token=data["token"]).first()
        if user:
            unlock_achiv = achiv_user(user)
            unlock_achiv.unlock_all()
            logging.debug(f"Get stats for user {user} and stats {unlock_achiv.proportion_list}")
            return jsonify(unlock_achiv.proportion_list), 200 
                # if dont return eror 
        else:
            logging.warning(f"User Not found")
            return jsonify({"error": " user not found"}), 404


    except Exception as e:
        # roll back if error
        session.rollback()
        message = "Error while unlocking trophies"
        logging.error(f"{message}: {e}")
        return jsonify({"message": str(e), "error": message}), 500

    finally:
        # Close session
        session.close()
          
if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=3002, debug=True)
           
# Run the Flask app with the specified configuration
# The configuration (host, port, debug) can be adjusted as needed or made configurable
# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=3001, debug=True)

