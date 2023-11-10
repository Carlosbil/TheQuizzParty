import logging
from flask_socketio import join_room, leave_room, emit
from flask import jsonify, request
from flask_cors import CORS
from dataBase import session, User, Room
from server import socketio, session
import secrets

logging.basicConfig(level=logging.DEBUG)

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    emit('status', {'msg': f'{username} has entered the room.'}, room=room)
    logging.debug(f'{username} has entered the room {room}')
    
@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    emit('status', {'msg': f'{username} has left the room.'}, room=room)
    logging.debug(f'{username} has left the room {room}')
    
@socketio.on('message')
def handle_message(data):
    emit('message', data, room=data['room'])
    logging.debug(f"Message received: {data}")

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
    """
    #quiero ver algo en la consola del servidor
    
    logging.debug("Join game event received")
    print("SALUDOOOOOOOOOOOOOS")
    token = data["token"]
    room_name = data.get("room")

    user = session.query(User).filter_by(token=token).first()
    if not user:
        emit('error', {'message': "The user could not be found"})
        logging.debug(f"User not found with token {token}")
        return

    room = None
    if not room_name:
        room = session.query(Room).filter_by(is_occupied=False).first()
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
    session.commit()

    join_room(room.name)
    emit('join_game_response', {'username': user.username, 'room': room.name}, room=room.name)
    logging.debug(f"User {user.username} joined room {room.name}")

@socketio.on('leave_game')
def leave_game(data):
    """
    This function handles the event of a user leaving a game room.
    It receives a dictionary with the user's token and the room's name.
    It updates the number of players in the room and sets the room as unoccupied if there are less than 10 players.
    It emits a 'leave' event to the room with the username and room name of the user who left.
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
