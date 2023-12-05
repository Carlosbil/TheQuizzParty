import unittest
from unittest.mock import patch
from socketio_handler import join_game

class TestSocketIOHandler(unittest.TestCase):

    def setUp(self):
        # Configurar el entorno de prueba si es necesario
        pass

    def tearDown(self):
        # Limpiar el entorno de prueba si es necesario
        pass

    def test_join_game_user_not_found(self):
        # Prueba cuando el usuario no se encuentra en la base de datos
        data = {"token": "invalid_token"}
        with patch("socketio_handler.emit") as mock_emit:
            join_game(data)
            mock_emit.assert_called_with('error', {'message': "The user could not be found"})

    def test_join_game_new_room(self):
        # Prueba cuando se une a una nueva sala
        data = {"token": "valid_token"}
        with patch("socketio_handler.session") as mock_session:
            mock_user = mock_session.query.return_value.filter_by.return_value.first.return_value
            mock_user.username = "test_user"
            mock_room = mock_session.query.return_value.filter_by.return_value.order_by.return_value.first.return_value
            mock_room.name = None
            mock_room.is_occupied = False
            mock_room.number_players = 0
            join_game(data)
            mock_session.query.assert_called_with(User)
            mock_session.query.return_value.filter_by.assert_called_with(token="valid_token")
            mock_session.commit.assert_called()
            mock_session.add.assert_called()
            mock_room.players.append.assert_called_with("test_user")
            mock_session.query.return_value.filter_by.return_value.update.assert_called_with({'players': mock_room.players})
            mock_session.commit.assert_called()
            mock_emit.assert_called_with('join_game_response', {'username': "test_user", 'room': mock_room.name, 'players': {}, 'health': 50}, room=mock_room.name)
            mock_emit.assert_called_with('update_players', {'players': {}}, room=mock_room.name)

    # Agrega más pruebas según sea necesario

if __name__ == "__main__":
    unittest.main()