# En app.py
from flask_socketio import SocketIO
from dataBase import session

socketio = SocketIO(cors_allowed_origins='*')
