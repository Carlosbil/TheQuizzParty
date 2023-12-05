#imports
from flask_socketio import emit, join_room, leave_room
from flask_cors import CORS
from dataBase import session, User, Room, Results
from app import socketio
import secrets
import logging
import random
from sqlalchemy import update
from flask import copy_current_request_context
import time
from threading import Thread
from tinkers import generate_questions, get_random_theme


logging.basicConfig(filename='./my_app.log', filemode='w', format='%(name)s - %(levelname)s - %(message)s', level=logging.DEBUG)


health= {'Room 1':{}, 'Room 2':{}}
stop={}
started={}

"""
doble = doble your health (maximun +20)
health = restore 10 health points
restore = restore 4 health points for each correct answer in this round
thief = steal one health point from the rest of the players
mafia = steal 5 points from one player randomly
"""
bonus = ["doble", "health", "restore", "thief", "mafia"]
bonus_to_send = ["thief", "mafia"]
"""
______________SOCKET IO____________________


"""

@socketio.on('join_game')
def join_game(data):
    """
    This function handles the event of a user joining a game room.
    It receives a token and a room name (optional) from the client.
    If the user is not found, it emits an error message and disconnects the user.
    If no room name is provided, it looks for an unoccupied room and joins the user to it.
    If no unoccupied room is found, it creates a new one and joins the user to it.
    If the room is full, it sets the room as occupied.
    Finally, it emits a 'join' event to the room with the username and room name.

    :param data: A dictionary containing the token and room name (optional) sent by the client.
    :type data: dict
    :return: None
    """
    #quiero ver algo en la consola del servidor
    
    token = data["token"]
    room_name = data.get("room")
    user = session.query(User).filter_by(token=token).first()
    if not user:
        emit('error', {'message': "The user could not be found"})
        logging.debug(f"User not found with token {token}")
        return

    room = None
    if not room_name:
        # If no room name is provided, look for an unoccupied room wich has more players than the others
        room = session.query(Room).filter_by(is_occupied=False).order_by(Room.number_players.desc()).first()
        if not room:

            while True:
                room_name = secrets.token_hex(4)
                if not session.query(Room).filter_by(name=room_name).first():
                    break
                
            room = Room(name=room_name, is_occupied=False, number_players=0)
            session.add(room)
            session.commit()
    # healths of players
    if room_name not in health:
        health[room_name] = {}
    health[room_name][user.username] = 50
    room.number_players += 1
    
    # If the room is full, set it as occupied
    if room.number_players == 10:
        room.is_occupied = True
    if room.players is None:
        room.players = []
    
    # update players to the users in the room
    room.players.append(user.username)
    session.query(Room).filter_by(name=room.name).update({'players': room.players})
    session.commit()
    join_room(room.name)
    players = {}
    for name in room.players:
        players[name] = session.query(User).filter_by(username=name).first().image_path
    emit('join_game_response', {'username': user.username, 'room': room.name, 
                                'players': players, 'health': health[room_name][user.username]},
         room=room.name)
    emit('update_players',  {'players': players}, room=room.name)
    logging.debug(f"User {user.username} joined room {room.name}")
    stop[room.name] = False

    if room.number_players == 1:
        # copy the context of the request to the function
        @copy_current_request_context
        def start_timer():
            global stop
            global bonus
            global health
            countdown_timer(room.name, 5)  # 4s for testing purposes

        # Start the temporizer in a new thread
        thread = Thread(target=start_timer)
        thread.start()
    session.close()
    


@socketio.on('join')
def on_join(data):
    """
    Adds a user to a room and emits a status message to the room.

    Parameters:
        data (dict): A dictionary containing the username and room.

    Returns:
        None
    """
    username = data['username']
    room = data['room']
    join_room(room)
    emit('status', {'msg': f'{username} has entered the room.'}, room=room)
    logging.debug(f'{username} has entered the room {room}')
    
@socketio.on('leave')
def on_leave(data):
    """
    Function that handles the 'leave' event emitted by the client.

    Parameters:
    data (dict): A dictionary containing the username and room of the user leaving.

    Returns:
    None
    """
    username = data['username']
    room = data['room']
    leave_room(room)
    emit('status', {'msg': f'{username} has left the room.'}, room=room)
    logging.debug(f'{username} has left the room {room}')
    
@socketio.on('message')
def handle_message(data):
    """
    Handle incoming message from client and emit it to the same room.

    Parameters:
        data (dict): A dictionary containing the message and the room where it was sent.

    Returns:
        None
    """
    emit('message', data, room=data['room'])
    


# This function handles the event of a user joining a game room.
@socketio.on('leave_game')
def leave_game(data):
    """
    This function handles the event of a user leaving a game room.
    It receives a dictionary with the user's token and the room's name.
    It updates the number of players in the room and sets the room as unoccupied if there are less than 10 players.
    It emits a 'leave' event to the room with the username and room name of the user who left.

    :param data: A dictionary containing the user's token and the room's name.
    :type data: dict
    :return: None
    """
    token = data["token"]
    room_name = data["room"]
    user = session.query(User).filter_by(token=token).first()
    if not user:
        emit('error', {'message': "The user could not be found"})
        logging.debug(f"User not found with token {token}")
        return
    room = session.query(Room).filter_by(name=room_name).first()
    if not room:
        emit('error', {'message': "The room could not be found"})
        logging.debug(f"Room not found with name {room_name}")
        return
    room.number_players -= 1
    if room.number_players < 10:
        if not started.get(room.name):
            room.is_occupied = False
    if room.number_players == 0:
        stop[room_name] = True
        logging.debug(f"Room {room_name} stopped")
    
    session.commit()
    leave_room(room.name)
    emit('leave', {'username': user.username, 'room': room.name}, room=room.name)
    players = {}
    for name in room.players:
        if name != user.username:
            players[name] = session.query(User).filter_by(username=name).first().image_path
    emit('update_players',  {'players': players}, room=room.name)

    session.close()
    

def countdown_timer(room_name, duration, round=1, bonus=False):
    """
    Countdown timer that emits the remaining time every second.
    :param room_name: Name of the room.
    :param duration: Duration of the countdown in seconds.
    """
    for remaining_time in range(duration, 0, -1):
        if not stop.get(room_name):
            emit('timer', {'time': remaining_time}, room=room_name)
            time.sleep(1)
    # Handle what happens when the timer ends
    emit('timer_end', room=room_name)
    if not stop.get(room_name) and round < 5:
        if bonus:
            send_bonus(room_name, round)
        else:
            time.sleep(1)            
            start_game({'room': room_name, "round": round})
        
    
def start_game(data):
    """
    this fucntion will receive the votes of the them from all the users and will save them in a dictionary
    if the user is not found it will emit an error message
    if the room is not found it will emit an error message
    :param data: A dictionary containing the user's token and the room's name.
    :type data: dict
    :return: None
    """
    if not stop.get(data["room"]):
        started[data["room"]] = True
        room_name = data["room"]
        theme = get_random_theme()
        room = session.query(Room).filter_by(name=room_name).first()
        if not room:
            emit('error', {'message': "The room could not be found"})
            logging.debug(f"Room not found with name {room_name}")
            return
        #avoid others players to join in the middle of the game
        room.is_occupied = True
        #get 5 questions
        questions = generate_questions(theme=theme, number=5)
        session.commit()
        emit('first_round', {'questions': questions, 'theme': theme}, room=room.name)
        countdown_timer(room.name, 30, bonus=True) 
              

@socketio.on('save_score')
def save_results(data):
    """
    this function will save the results of the first round
    :param data: A dictionary containing the user's token and the room's name.
    :type data: dict
    :return: None
    """
    try:
        token = data["token"]
        room_name = data["room"]
        results = data.get("score", 0)
        theme = data["theme"]
        health_user= data["health"]
        # Accerted and wrong answers
        accerted = results
        wrong = 5 - results
        
        user, room = obtain_user_session(token, room_name, session)
        if not user or not room:
            return
        
        # Update the results
        results_entry = session.query(Results).filter_by(username=user.username).first()
        if results_entry:
            session.query(Results).filter_by(username=user.username).update({
                QUESTION_MAP[theme][0]: results_entry.__dict__[QUESTION_MAP[theme][0]] + accerted,
                QUESTION_MAP[theme][1]: results_entry.__dict__[QUESTION_MAP[theme][1]] + wrong
            })
        else:
            new_results = Results(username=user.username, **{
                QUESTION_MAP[theme][0]: accerted,
                QUESTION_MAP[theme][1]: wrong
            })
            session.add(new_results)

        # Update the health
        health[room_name][user.username] = health_user
        emit('players_health', {'health': health[room_name]}, room=room_name)
        session.commit()
        logging.debug(f"Results saved in {room.name} for the user {user.username} with health {health}")
    except Exception as e:
        if session:
            session.rollback()
        logging.error(f"Error while saving sores and health {e}")
        emit('error', {'message': "No se pueden guardar los resultados"})
    finally:
        if session:
            session.close()


#send 3 rndom bonus to the room
def send_bonus(room_name, round):
    """
    this function will send 3 random bonus to the room
    :param room_name: the name of the room
    :param round: the round of the game
    :type data: dict
    :return: None
    """
    bonus_list = []
    for i in range(3):
        #get a random bonus
        bonus_list.append(bonus[random.randint(0,4)])
    emit('bonus', {'bonus': bonus_list}, room=room_name)
    countdown_timer(room_name, 20, round, False) 

@socketio.on('bonus_answer')  
def receive_bonus(data):
    token = data.get("token", None)
    room_name = data.get("room", None)
    bonus = data.get("bonus", None)
    logging.debug(f"Bonus received {bonus}")
    user, room = obtain_user_session(token, room_name, session)
    if not user or not room:
        return
   
    if bonus == "health":
        health[room_name][user.username] += 20
        emit('players_health', {'health': health[room_name]}, room=room_name)
    elif bonus == "thief":
        health[room_name][user.username] += 2*len(health[room_name])
        for player in health[room_name]:
            if player != user.username:
                health[room_name][player] -= 2
        emit('players_health', {'health': health[room_name]}, room=room_name)
    elif bonus == "mafia":
        health[room_name][user.username] += 6
        #select a random player
        player = random.choice(list(health[room_name].keys()))
        if player != user.username:
                health[room_name][player] -= 6
        emit('players_health', {'health': health[room_name]}, room=room_name)
    elif bonus == "doble":
        if health[room_name][user.username] < 15:
            health[room_name][user.username] *=2
        else:
            health[room_name][user.username] += 30
        emit('players_health', {'health': health[room_name]}, room=room_name)
               
def obtain_user_session(token, room_name, session):
            # Search for the user and the room
    try:
        user = session.query(User).filter_by(token=token).first()
        if not user:
            emit('error', {'message': "No se pudo encontrar al usuario"})
            logging.debug(f"Usuario no encontrado con token {token}")
            return

        room = session.query(Room).filter_by(name=room_name).first()
        if not room:
            emit('error', {'message': "No se pudo encontrar la sala"})
            logging.debug(f"Sala no encontrada con nombre {room_name}")
            return
        return user, room
    
    except Exception as e:
        if session:
            session.rollback()
        logging.error(f"User or room couldnt be found: {e}")
        emit('error', {'message': "No se pudo encontrar al usuario o la sala"})
    finally:
        if session:
            session.close()
    
QUESTION_MAP = {
    'history': ['history_accerted', 'history_wrong'],
    'geography': ['geography_accerted', 'geography_wrong'],
    'sports': ['sports_accerted', 'sports_wrong'],
    'entertainment': ['entertainment_accerted', 'entertainment_wrong'],
    'literature': ['literature_accerted', 'literature_wrong'],
    'science': ['science_accerted', 'science_wrong'],
    'pop_culture': ['pop_culture_accerted', 'pop_culture_wrong']
}