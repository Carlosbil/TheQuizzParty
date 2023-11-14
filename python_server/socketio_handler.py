#imports
from flask_socketio import emit, join_room, leave_room
from flask_cors import CORS
from dataBase import session, User, Room
from app import socketio
import secrets
import logging
from sqlalchemy import update

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
    room.players.append(user.username)
    session.query(Room).filter_by(name=room.name).update({'players': room.players})
    session.commit()
    join_room(room.name)
    players = {}
    for name in room.players:
        players[name] = session.query(User).filter_by(username=name).first().image_path
    emit('join_game_response', {'room': room.name, 'players': players}, room=room.name)
    logging.debug(f"User {user.username} joined room {room.name}")
    session.close()
    #if len(room.players) == 1:
    #    socketio.start_background_task(start_clock, {'room': room.name})        


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
    emit('leave', {'room': room.name}, room=room.name)
    logging.debug(f"User {user.username} left room {room.name}")
    session.close()

timers_state = {}

@socketio.on('start_clock')
def start_clock(data):
    room = data['room']
    timers_state[room] = True  
    logging.debug(f"Starting game in: {room}")

    for time in range(60, -1, -1):
        if not timers_state[room]: 
            break
        socketio.sleep(1)
        socketio.emit('timer', {'timeRemaining': time}, room=room)  # Use socketio.emit() instead of emit()
        logging.debug(f"Time remaining: {time} for room {room}")

    if timers_state[room]:
        socketio.emit('start_game', {'message': "The game is about to start"}, room=room)  # Use socketio.emit() instead of emit()
        logging.debug(f"Game started in room {room}")
    else:
        logging.debug(f"Timer stopped in room {room}")

@socketio.on('stop_clock')
def stop_clock(data):
    room = data['room']
    timers_state[room] = False
    logging.debug(f"Timer stopped manually in room {room}")
