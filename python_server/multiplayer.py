from flask_socketio import join_room, leave_room, emit
from flask import jsonify, request
from flask_cors import CORS
from dataBase import session, User, Room
from server import socketio, session

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    emit('status', {'msg': f'{username} has entered the room.'}, room=room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    emit('status', {'msg': f'{username} has left the room.'}, room=room)

@socketio.on('message')
def handle_message(data):
    emit('message', data, room=data['room'])

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
    print("a")
    token = data["token"]
    room_name = data.get("room")

    user = session.query(User).filter_by(token=token).first()
    if not user:
        emit('error', {'message': "The user could not be found"})
        disconnect()  # Desconectar al usuario si no se encuentra
        return

    room = None
    if not room_name:
        room = session.query(Room).filter_by(is_occupied=False).first()
        if not room:
            room = Room(name="SomeUniqueName", is_occupied=False, number_players=0)
            session.add(room)
            session.commit()

    room.number_players += 1
    if room.number_players == 10:
        room.is_occupied = True
    session.commit()

    join_room(room.name)
    emit('join', {'username': user.username, 'room': room.name}, room=room.name)

@socketio.on('leave_game')
#crear una funcion que saque al usuario de la sala, teniendo en cuenta que se 
#envia el token del usuario y la sala en la que esta
def leave_game(data):
    token = data["token"]
    room_name = data["room"]
    user = session.query(User).filter_by(token=token).first()
    if not user:
        emit('error', {'message': "The user could not be found"})
        return
    room = session.query(Room).filter_by(name=room_name).first()
    if not room:
        emit('error', {'message': "The room could not be found"})
        return
    room.number_players -= 1
    if room.number_players < 10:
        room.is_occupied = False
    session.commit()
    leave_room(room.name)
    emit('leave', {'username': user.username, 'room': room.name}, room=room.name)