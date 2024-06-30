from app import socketio, logging

logging.info("Testeando")

@socketio.on('message')
def handle_message(msg):
    logging('Mensaje recibido: ' + msg)
    socketio.send('Echo: ' + msg)
