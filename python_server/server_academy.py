import datetime
from flask import Flask, jsonify, request
from flask_socketio import SocketIO, join_room, leave_room, emit
import json, random
from flask_cors import CORS
import logging
import os
import base64
from  dataBase import User, Score, Questionary, Room, Results, Academy
from  tinkers import generate_questions, get_weekly_questions, QUESTION_MAP
from  bcrypt import hashpw, gensalt, checkpw
#from  app import socketio
from  dataBase import User, get_session
from  to_unlock import achiv_user
from flask import Blueprint
from utils import generate_token, token_exists, is_token_valid

second_app = Blueprint('second_app', __name__)

@second_app.route('/second')
def second():
    return "Hola desde la segunda app!"

logging.basicConfig(filename="./my_app.log", filemode="w", format="%(name)s - %(levelname)s - %(message)s", level=logging.DEBUG)
themes = ["history", "geography", "sports", "entertainment", "literature", "science", "pop_culture"]

"""
______________API____________________

"""
@second_app.route("/academy/createUser", methods=["POST"])
def create_user():
    try:
    # Add new user from the academy
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
            "username":user.username,
            "academy": data["academy"]
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
    
@second_app.route("/academy/logIn", methods=["POST"])
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
           
        
@second_app.route("/academy/addQuestionary", methods=["POST"])
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
        
        
@second_app.route("/academy/postProfile", methods=["POST"])       
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
        

@second_app.route("/academy/userStats", methods=["POST"])       
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
          