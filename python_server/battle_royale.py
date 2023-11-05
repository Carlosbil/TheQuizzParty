from flask import Flask
from flask_socketio import SocketIO, join_room, leave_room, send
import random
import string

class Room:
    def __init__(self, id):
        self.id = id
        self.players = {}  # Dict of Player objects
        self.playing = False
        
    def add_player(self, player, avatar):
        #if the match has started, cant join other players
        if self.playing:
            return False
        #while there is not 10 player, can join more playres
        if len(self.players) < 10:
            self.players[player] = {"player": player, "avatar": avatar}
            return True
        return False
    
    def get_players(self):
        return self.players
    def remove_player(self, player_id):
        self.players = [player for player in self.players if player.name != player_id]

class Game:
    def __init__(self):
        self.rooms = {}  # Dictionary to hold rooms

    def create_room(self):
        # Create a random room ID
        room_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        while room_id in self.rooms:
            room_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        room = Room(room_id)
        self.rooms[room_id] = room
        return room_id
    def get_room_players(self,room_id):
        room = self.rooms.get(room_id, None)
        if room:
            return room.get_players()
        return
        
    def add_player_to_room(self, player, avatar, room_id=None):
        if room_id:
            room = self.rooms.get(room_id)
            if room and room.add_player(player, avatar):
                return room_id
        new_room_id = self.create_room()
        self.rooms[new_room_id].add_player(player, avatar)
        return new_room_id


    def remove_player_from_room(self, player_id, room_id):
        room = self.rooms.get(room_id)
        if room:
            room.remove_player(player_id)