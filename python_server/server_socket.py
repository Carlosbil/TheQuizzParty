from app import socketio, logging

@socketio.on('message')
def handle_message(msg):
    logging('Mensaje recibido: ' + msg)
    socketio.send('Echo: ' + msg)
