import unittest
from unittest.mock import patch
from server import app, save_score

class TestServer(unittest.TestCase):

    def setUp(self):
        # Configurar el entorno de prueba si es necesario
        pass

    def tearDown(self):
        # Limpiar el entorno de prueba si es necesario
        pass

    def test_save_score_success(self):
        # Prueba cuando el puntaje se guarda exitosamente
        data = {
            "token": "valid_token",
            "score": 100,
            "time_taken": 60,
            "correct_questions": 10
        }
        with patch("server.request") as mock_request, \
             patch("server.session") as mock_session, \
             patch("server.jsonify") as mock_jsonify:
            mock_request.get_json.return_value = data
            mock_user = mock_session.query.return_value.filter_by.return_value.first.return_value
            mock_user.username = "test_user"
            save_score()
            mock_session.query.assert_called_with(User)
            mock_session.query.return_value.filter_by.assert_called_with(token="valid_token")
            mock_session.query.return_value.filter_by.return_value.first.assert_called()
            mock_session.query.assert_called_with(Score)
            mock_session.query.return_value.filter_by.assert_called_with(username="test_user")
            mock_session.commit.assert_called()
            mock_jsonify.assert_called_with({"message": "Score saved successfully"}), 200

    def test_save_score_invalid_token(self):
        # Prueba cuando el token es inválido
        data = {
            "token": "invalid_token",
            "score": 100,
            "time_taken": 60,
            "correct_questions": 10
        }
        with patch("server.request") as mock_request, \
             patch("server.session") as mock_session, \
             patch("server.jsonify") as mock_jsonify:
            mock_request.get_json.return_value = data
            mock_session.query.return_value.filter_by.return_value.first.return_value = None
            save_score()
            mock_session.rollback.assert_called()
            mock_jsonify.assert_called_with({"error": "Invalid token or score"}), 401

    def test_save_score_error(self):
        # Prueba cuando ocurre un error al guardar el puntaje
        data = {
            "token": "valid_token",
            "score": 100,
            "time_taken": 60,
            "correct_questions": 10
        }
        with patch("server.request") as mock_request, \
             patch("server.session") as mock_session, \
             patch("server.jsonify") as mock_jsonify:
            mock_request.get_json.return_value = data
            mock_session.query.return_value.filter_by.return_value.first.return_value = None
            mock_session.commit.side_effect = Exception("Database error")
            save_score()
            mock_session.rollback.assert_called()
            mock_jsonify.assert_called_with({"message": "Database error", "error": "Error while saving score"}), 500

    # Agrega más pruebas según sea necesario

if __name__ == "__main__":
    unittest.main()