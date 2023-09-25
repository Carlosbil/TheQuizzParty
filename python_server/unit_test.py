import unittest
from server import app
import json

class FlaskServerTestCase(unittest.TestCase):

    def setUp(self):
        # Set up the test client for the Flask application
        app.config['TESTING'] = True
        self.app = app.test_client()

    def test_get_question(self):
        # Test if the server responds with a question for an existing theme
        response = self.app.get('/api/questions?data=history')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('question', data)

    def test_non_existent_theme(self):
        # Test if the server responds with an error for a non-existent theme
        response = self.app.get('/api/questions?data=non_existent_theme')
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.data)
        self.assertIn('error', data)

if __name__ == '__main__':
    unittest.main()
