#imports
from flask_socketio import emit, join_room, leave_room
from flask_cors import CORS
from dataBase import session, User, Room, Results
from app import socketio
import secrets
import logging
from sqlalchemy import update
from flask import copy_current_request_context
import time
from threading import Thread
from tinkers import generate_questions, get_random_theme


logging.basicConfig(filename='./my_app.log', filemode='w', format='%(name)s - %(levelname)s - %(message)s', level=logging.DEBUG)
logging.debug('Mensaje de debug')
logging.info('Mensaje de información')
logging.warning('Mensaje de advertencia')
logging.error('Mensaje de error')
logging.critical('Mensaje crítico')

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
    
    logging.debug("Join game event received")
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

    room.number_players += 1
    if room.number_players == 10:
        room.is_occupied = True
    if room.players is None:
        room.players = []
    room.players.append(user.username)
    session.query(Room).filter_by(name=room.name).update({'players': room.players})
    session.commit()
    join_room(room.name)
    players = {}
    for name in room.players:
        players[name] = session.query(User).filter_by(username=name).first().image_path
    emit('join_game_response', {'username': user.username, 'room': room.name, 'players': players}, room=room.name)
    logging.debug(f"User {user.username} joined room {room.name}")
    if room.number_players == 1:
        # copy the context of the request to the function
        @copy_current_request_context
        def start_timer():
            countdown_timer(room.name, 4)  # 4s for testing purposes

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
    logging.debug(f"Message received: {data}")


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
    logging.debug("Leave game event received")
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
        room.is_occupied = False
    session.commit()
    leave_room(room.name)
    emit('leave', {'username': user.username, 'room': room.name}, room=room.name)
    logging.debug(f"User {user.username} left room {room.name}")
    session.close()

def countdown_timer(room_name, duration, round=1):
    """
    Countdown timer that emits the remaining time every second.
    :param room_name: Name of the room.
    :param duration: Duration of the countdown in seconds.
    """
    for remaining_time in range(duration, 0, -1):
        emit('timer', {'time': remaining_time}, room=room_name)
        time.sleep(1)
    # Handle what happens when the timer ends
    emit('timer_end', room=room_name)
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
    logging.debug("Start game event received")
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
    emit('first_round', {'questions': questions}, room=room.name)
    @copy_current_request_context
    def start_timer_game():
        countdown_timer(room.name, 40) 
            # Iniciar el temporizador como una tarea en segundo plano
    thread = Thread(target=start_timer_game)
    thread.start()
    logging.debug(f"Game started in room {room.name}")
      

@socketio.on('save_results')
def save_results(data):
    """
    this function will save the results of the first round
    :param data: A dictionary containing the user's token and the room's name.
    :type data: dict
    :return: None
    """
    try:
        logging.debug("Save results event received")
        token = data["token"]
        room_name = data["room"]
        results = data["results"]
        theme = data["theme"]
        accerted = results.get("accerted")
        wrong = results.get("wrong")
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
        #update the results
        tinkers = session.query(Results).filter_by(username=user.username).first()
        #update the columns that match with the theme
        if tinkers:
            if accerted:
                session.query(Results).filter_by(username=user.username).update({QUESTION_MAP[theme][0]: tinkers.__dict__[QUESTION_MAP[theme][0]] + 1})
            if wrong:
                session.query(Results).filter_by(username=user.username).update({QUESTION_MAP[theme][1]: tinkers.__dict__[QUESTION_MAP[theme][1]] + 1})
        else:
            if accerted:
                tinkers = Results(username=user.username, **{QUESTION_MAP[theme][0]: accerted})
            if wrong:
                tinkers = Results(username=user.username, **{QUESTION_MAP[theme][1]: wrong})
            session.add(tinkers)
        session.commit()
        logging.debug(f"Results saved in room {room.name} for user {user.username}")
        session.close()
    except Exception as e:
        logging.error(f"Error saving results {e}")
        emit('error', {'message': "Cannot save results"})
        return
    
    session.commit()
    emit('second_round', room=room.name)
    logging.debug(f"Results saved in room {room.name}")
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