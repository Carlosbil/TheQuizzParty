#imports
from flask_socketio import emit, join_room, leave_room
from dataBase import init_db, User, Room, Results
from app import socketio
import secrets
import logging
import random
from flask import copy_current_request_context
import time
import eventlet
from tinkers import generate_questions, get_random_theme
import copy
import threading

logging.basicConfig(filename="./my_app.log", filemode="w", format="%(name)s - %(levelname)s - %(message)s", level=logging.DEBUG)

restored = {}
health= {"BEING_USED":False}
stop={}
started={}
"""
doble = doble your health (maximun +20)
health = restore 10 health points
restore = restore 4 health points for each correct answer in this round
thief = steal one health point from the rest of the players
mafia = steal 5 points from one player randomly
"""
bonus = [
    "doble: dobla tu vida, (max +18) 😊", 
    "health: obten 10 puntos de vida 😊", 
    "restore: obten 2 puntos de vida más por respuesta correcta 😊", 
    "thief: roba 2 puntos de vida a cada jugador 😊", 
    "mafia: roba 8 puntos de vida a un jugador aleatorio 😊"
    ]

bonus_lvl_2 = [
    "doble: dobla tu vida, (max +9) 😡", 
    "health: obten 9 puntos de vida 😡", 
    "restore: obten 2 puntos de vida más por respuesta correcta 😡", 
    "thief: roba 3 puntos de vida a cada jugador 😡", 
    "mafia: roba 10 puntos de vida a un jugador aleatorio 😡"
    ]

bonus_lvl_3 = [
    "doble: dobla tu vida, (max +8) 😈", 
    "health: obten 6 puntos de vida 😈", 
    "restore: obten 2 puntos de vida más por respuesta correcta 😈", 
    "thief: roba 2 puntos de vida a cada jugador 😈", 
    "mafia: roba 9 puntos de vida a un jugador aleatorio 😈"
    ]
"""
______________SOCKET IO____________________


"""
health_lock = threading.Lock()
# This function handles health modification career condition avoided 
def modify_health(health_data, room_name, delete=False):
    # Adquirir el lock antes de acceder al recurso compartido
    with health_lock:
        # Realizar operaciones con el recurso compartido
        if not delete:
            health[room_name] = health_data
        else:
            health.pop(room_name, None)

    
@socketio.on("join_game")
def join_game(data):
    """
    This function handles the event of a user joining a game room.
    It receives a token and a room name (optional) from the client.
    If the user is not found, it emits an error message and disconnects the user.
    If no room name is provided, it looks for an unoccupied room and joins the user to it.
    If no unoccupied room is found, it creates a new one and joins the user to it.
    If the room is full, it sets the room as occupied.
    Finally, it emits a "join" event to the room with the username and room name.

    :param data: A dictionary containing the token and room name (optional) sent by the client.
    :type data: dict
    :return: None
    """
    #quiero ver algo en la consola del servidor
    try:
        session = init_db()
        token = data["token"]
        room_name = data.get("room")
        user = session.query(User).filter_by(token=token).first()
        if not user:
            emit("error", {"message": "The user could not be found"})
            # logging.debug(f"User not found with token {token}")
            
        else:
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
                else:
                    room_name = room.name
            # healths of players
            # logging.debug(f"Room {room_name} has {room.number_players} players")
            if room_name not in health:
                health[room_name] = {}
                
            room_health_data = copy.deepcopy(health[room_name])
            room_health_data[user.username] = 50
            modify_health(room_health_data, room_name)
            # logging.debug(f"Current health {health}")

            room.number_players += 1
            
            # If the room is full, set it as occupied
            if room.number_players == 10:
                room.is_occupied = True
            if room.players is None:
                room.players = []
            
            # update players to the users in the room
            room.players.append(user.username)
            session.query(Room).filter_by(name=room.name).update({"players": room.players})
            session.commit()
            join_room(room.name)
            players = {}
            for name in room.players:
                players[name] = session.query(User).filter_by(username=name).first().image_path
            emit("join_game_response", {"username": user.username, "room": room.name, 
                                        "players": players, "health": health[room_name][user.username]},
                room=room.name)
            emit("update_players",  {"players": players}, room=room.name)
            # logging.debug(f"User {user.username} joined room {room.name}")
            stop[room.name] = False

            if room.number_players == 1:
                # Function that starts the temporizer
                def start_timer():
                    global stop
                    global bonus
                    global health
                    global restored
                    global health_lock
                    countdown_timer(room.name, 40)  # 4s for testing purposes

                # Start the temporizer in a new thread
                @copy_current_request_context
                def start_timer_eventlet():
                    start_timer()
                eventlet.spawn(start_timer_eventlet)
    except Exception as e:
        if session:
            session.rollback()
        logging.error(f"Error while joining game: {e}")
        emit("error", {"message": "No se pudo unir al juego"})
    finally:
        if session:
            session.close()


# This function handles the event of a user joining a game room.
@socketio.on("leave_game")
def leave_game(data):
    """
    This function handles the event of a user leaving a game room.
    It receives a dictionary with the user"s token and the room"s name.
    It updates the number of players in the room and sets the room as unoccupied if there are less than 10 players.
    It emits a "leave" event to the room with the username and room name of the user who left.

    :param data: A dictionary containing the user"s token and the room"s name.
    :type data: dict
    :return: None
    """
    try:
        session = init_db()
        token = data["token"]
        room_name = data["room"]
        user = session.query(User).filter_by(token=token).first()
        if not user:
            emit("error", {"message": "The user could not be found"})
            # logging.debug(f"User not found with token {token}")
        else:
            room = session.query(Room).filter_by(name=room_name).first()
            if not room:
                emit("error", {"message": "The room could not be found"})
                # logging.debug(f"Room not found with name {room_name}")
            else:
                room.number_players -= 1
                if room.number_players < 10:
                    if not started.get(room.name):
                        room.is_occupied = False
                if room.number_players == 0:
                    stop[room_name] = True
                    modify_health({}, room_name, delete=True)
                    # logging.debug(f"Room {room_name} stopped")
            
            session.commit()
            leave_room(room.name)
            emit("leave", {"username": user.username, "room": room.name}, room=room.name)
            players = {}
            for name in room.players:
                if name != user.username:
                    players[name] = session.query(User).filter_by(username=name).first().image_path
            emit("update_players",  {"players": players}, room=room.name)
    except Exception as e:
        if session:
            session.rollback()
        logging.error(f"Error while leaving game: {e}")
        emit("error", {"message": "No se pudo salir del juego"})
    finally:
        if session:
            session.close()
    

def countdown_timer(room_name, duration, round=1, bonus=False):
    """
    Countdown timer that emits the remaining time every second.
    :param room_name: Name of the room.
    :param duration: Duration of the countdown in seconds.
    """
    
    for remaining_time in range(duration, 0, -1):
        if not stop.get(room_name):
            emit("timer", {"time": remaining_time}, room=room_name)
            time.sleep(1)
    # Handle what happens when the timer ends
    emit("timer_end", room=room_name)
    if not stop.get(room_name) and round < 5:
        if bonus:
            send_bonus(room_name, round)
        else:          
            start_game({"room": room_name, "round": round+1})
        
    
def start_game(data):
    """
    this fucntion will receive the votes of the them from all the users and will save them in a dictionary
    if the user is not found it will emit an error message
    if the room is not found it will emit an error message
    :param data: A dictionary containing the user"s token and the room"s name.
    :type data: dict
    :return: None
    """
    try:
        session = init_db()
        if not stop.get(data["room"]):
            started[data["room"]] = True
            room_name = data["room"]
            theme = get_random_theme()
            room = session.query(Room).filter_by(name=room_name).first()
            if not room:
                emit("error", {"message": "The room could not be found"})
                # logging.debug(f"Room not found with name {room_name}")
            else:
                #avoid others players to join in the middle of the game
                room.is_occupied = True
                #get 5 questions
                questions = generate_questions(theme=theme, number=5)
                session.commit()
                emit("first_round", {"questions": questions, "theme": theme}, room=room.name)
                countdown_timer(room.name, 30, round=data.get("round", 1), bonus=True) 
    except Exception as e:
        if session:
            session.rollback()
        logging.error(f"Error while starting game: {e}")
        emit("error", {"message": "No se pudo iniciar el juego"})
    finally:
        if session:
            session.close()
              

@socketio.on("save_score")
def save_results(data):
    """
    this function will save the results of the first round
    :param data: A dictionary containing the user"s token and the room"s name.
    :type data: dict
    :return: None
    """
    try:
        session = init_db()
        token = data["token"]
        room_name = data["room"]
        results = data.get("score", 0)
        theme = data["theme"]
        health_user= data["health"]
        # Accerted and wrong answers
        accerted = results
        wrong = 5 - results
        health_user -= wrong*6

        user, room = obtain_user_session(token, room_name)
        if not user or not room:
            logging.error(f"Error while saving sores and health: user or room no found")
            emit("error", {"message": "No se pueden guardar los resultados"})
        else:
            if user.username in restored:
                health_user += accerted*5
                restored.pop(user.username)
            else:
                health_user += accerted*2
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
            if room_name in health:
                if user.username in health[room_name]:
                    room_health_data = health[room_name]
                    room_health_data[user.username] = health_user
                    modify_health(room_health_data, room_name)
                else:
                    logging.error(f"Username key {user.username} not found in health for room {room_name}")
            else:
                logging.error(f"Room key {room_name} not found in health")
            emit("players_health", {"health": health[room.name]}, room=room.name)
            session.commit()
            logging.debug(f"Results saved in {room.name} for the user {user.username} with health {health}")
    except Exception as e:
        if session:
            session.rollback()
        logging.error(f"Error while saving sores and health {e}")
        emit("error", {"message": "No se pueden guardar los resultados"})
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
    if round < 4:
        selected_bon = bonus
    elif round < 7:
        selected_bon = bonus_lvl_2
    else:
        selected_bon = bonus_lvl_3
    for _ in range(3):
        # Get a random bonus not repeated
        bon = selected_bon[random.randint(0, len(selected_bon)-1)]
        while bon in bonus_list:
            bon = selected_bon[random.randint(0, len(selected_bon)-1)]
        bonus_list.append(bon)

    emit("bonus", {"bonus": bonus_list}, room=room_name)
    countdown_timer(room_name, 20, round, False) 

@socketio.on("bonus_answer")  
def receive_bonus(data):
    try:
        session = init_db()
        token = data.get("token", None)
        room_name = data.get("room", None)
        bonus = data.get("bonus", None)
        logging.debug(f"Bonus received {bonus}")
        user, room = obtain_user_session(token, room_name)
        if not user or not room:
            logging.error(f"Error while receiving bonus: user or room no found User: {user} Room: {room}")
            emit("error", {"message": "No se pudo recibir el bonus, usuario o sala no encontrados   "})
        else:
            selected_bonus = BONUS_MAP[bonus]
            logging.debug(f"Selected bonus {selected_bonus}")
            room_health_data = copy.deepcopy(health[room_name])
            
            if selected_bonus == "health":
                room_health_data[user.username] += 10
            elif selected_bonus == "health_lvl2":
                room_health_data[user.username] += 9
            elif selected_bonus == "health_lvl3":
                room_health_data[user.username] += 6
            elif selected_bonus == "thief":
                room_health_data[user.username] += len(room_health_data)-1*3
                if len(room_health_data) > 1:
                    for player in room_health_data:
                        if player != user.username:
                            room_health_data[player] -= 3
            elif selected_bonus == "thief_lvl2":
                room_health_data[user.username] += len(room_health_data)-1*2
                if len(room_health_data) > 1:
                    for player in room_health_data:
                        if player != user.username:
                            room_health_data[player] -= 2
            elif selected_bonus == "thief_lvl3":
                room_health_data[user.username] += len(room_health_data)-1*1
                if len(room_health_data) > 1:
                    for player in room_health_data:
                        if player != user.username:
                            room_health_data[player] -= 1
                            
            elif selected_bonus == "mafia":
                room_health_data[user.username] += 8
                #select a random player
                player = random.choice(list(room_health_data.keys()))
                if player != user.username:
                        room_health_data[player] -= 8
            elif selected_bonus == "mafia_lvl2":
                room_health_data[user.username] += 10
                #select a random player
                player = random.choice(list(room_health_data.keys()))
                if player != user.username:
                        room_health_data[player] -= 10
            elif selected_bonus == "mafia_lvl3":
                room_health_data[user.username] += 9
                #select a random player
                player = random.choice(list(room_health_data.keys()))
                if player != user.username:
                        room_health_data[player] -= 9
                        
            elif selected_bonus == "doble":
                if room_health_data[user.username] < 10:
                    room_health_data[user.username] *=2
                else:
                    room_health_data[user.username] += 20
            elif selected_bonus == "doble_lvl2":
                if room_health_data[user.username] < 5:
                    room_health_data[user.username] *=2
                else:
                    room_health_data[user.username] += 9
            elif selected_bonus == "doble_lvl3":
                if room_health_data[user.username] < 4:
                    room_health_data[user.username] *=2
                else:
                    room_health_data[user.username] += 8
                    
            elif selected_bonus == "restore":
                restored[user.username] = True
            elif selected_bonus == "restore_lvl2":
                restored[user.username] = True
            elif selected_bonus == "restore_lvl3":
                restored[user.username] = True
            if health > 50:
                health = 50 
            modify_health(room_health_data, room_name)
            emit("players_health", {"health": health[room_name]}, room=room_name)
    except Exception as e:
        if session:
            session.rollback()
        logging.error(f"Error while receiving bonus: the error is:{e}")
        emit("error", {"message": "No se pudo recibir el bonus"})
    finally:
        if session:
            session.close()
            
def obtain_user_session(token, room_name, session = None):
    # Search for the user and the room
    if not session:
        logging.error("No session found, creating new one")
        session = init_db()
    try: 
        user = session.query(User).filter_by(token=token).first()
        if not user:
            emit("error", {"message": "No se pudo encontrar al usuario"})
            logging.debug(f"Usuario no encontrado con token {token}")
            return None, None

        room = session.query(Room).filter_by(name=room_name).first()
        if not room:
            emit("error", {"message": "No se pudo encontrar la sala"})
            logging.debug(f"Sala no encontrada con nombre {room_name}")
            return None, None
        return user, room
    except Exception as e:
        if session:
            session.rollback()
        logging.error(f"Error while obtaining user and room: {e}")
        emit("error", {"message": "No se pudo obtener el usuario y la sala"})
        return None, None
    finally:
        if session:
            session.close()


    
QUESTION_MAP = {
    "history": ["history_accerted", "history_wrong"],
    "geography": ["geography_accerted", "geography_wrong"],
    "sports": ["sports_accerted", "sports_wrong"],
    "entertainment": ["entertainment_accerted", "entertainment_wrong"],
    "literature": ["literature_accerted", "literature_wrong"],
    "science": ["science_accerted", "science_wrong"],
    "pop_culture": ["pop_culture_accerted", "pop_culture_wrong"]
}

BONUS_MAP = {

    bonus[0]: "doble", 
    bonus[1]: "health", 
    bonus[2]: "restore", 
    bonus[3]: "thief", 
    bonus[4]: "mafia",
    bonus_lvl_2[0]: "doble_lvl2",
    bonus_lvl_2[1]: "health_lvl2",
    bonus_lvl_2[2]: "restore_lvl2",
    bonus_lvl_2[3]: "thief_lvl2",
    bonus_lvl_2[4]: "mafia_lvl2",
    bonus_lvl_3[0]: "doble_lvl3",
    bonus_lvl_3[1]: "health_lvl3",
    bonus_lvl_3[2]: "restore_lvl3",
    bonus_lvl_3[3]: "thief_lvl3",
    bonus_lvl_3[4]: "mafia_lvl3"
    
}