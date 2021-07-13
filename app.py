from flask import Flask, session, request, render_template, jsonify
from boggle import Boggle
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)

app.config['SECRET_KEY'] = 'secret-goes-here'
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

debug = DebugToolbarExtension(app)

boggle_game = Boggle()

@app.route('/')
def display_boggle_game():
    board = boggle_game.make_board()
    session['board'] = board

    return render_template('board.html', board=board)

@app.route('/guess')
def guess():
    board = session['board']
    word_guessed = request.args.get('guess')

    result = boggle_game.check_valid_word(board, word_guessed)
    
    return jsonify({'result': result})

@app.route('/score', methods=['POST'])
def score():
    score = request.json['score']

    high_score = session.get('high_score', 0)
    session['high_score'] = max(score, high_score)
    
    times_played = session.get('times_played', 0)
    session['times_played'] = times_played + 1

    return jsonify(newRecord=score > high_score)