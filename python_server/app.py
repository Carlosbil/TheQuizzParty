# En app.py
from flask_socketio import SocketIO
from flask import Flask
from server_academy import second_app
import logging

logging.basicConfig(filename="./my_app.log", filemode="w", format="%(name)s - %(levelname)s - %(message)s", level=logging.DEBUG)

app = Flask(__name__)
app.register_blueprint(second_app)
socketio = SocketIO(app, cors_allowed_origins="*", ping_timeout=600, ping_interval=25)

if __name__ == '__main__':
    socketio.run(app, port=5000)