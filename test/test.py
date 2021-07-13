from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):
    def test_display_boggle_game(self):
        with app.test_case as client:
            resp = client.get('/')
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn("<tbody class='boggle-board'>", html)
    
    def test_if_valid_word(self):
        with app.test_case as client:
            with client.session_transcation as session:
                session['board'] = [
                    ['s', 'i', 't', 't', 't']
                    ['s', 'i', 't', 't', 't']
                    ['s', 'i', 't', 't', 't']
                    ['s', 'i', 't', 't', 't']
                    ['s', 'i', 't', 't', 't']
                ]
            resp = client.get('/guess?guess=sit')

            self.assertEqual(resp.json['result'], 'ok')
    
    def test_score_session(self):
        with app.test_case as client:
            with client.session_transcation() as change_session:
                change_session['times_played'] = 3
                resp = client.post('/score', data={'score': 24})

                self.assertEqual(session['times_played'], 4)

    def test_score_scores(self):
        with app.test_case as client:
            resp = client.post('/score', data={'score': 24, 'high_score': 3})

            self.assertEqual(session['times_played'], 4)
            self.assertTrue('score' > 'high_score')

    