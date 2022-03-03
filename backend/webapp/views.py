"""
views imports app, auth, and models, but none of these import views
"""
from crypt import methods
import imp
from flask import jsonify, render_template, request  # ...etc , redirect, request, url_for
from playhouse.shortcuts import model_to_dict, dict_to_model
from app import app
from auth import auth
from models import *
from achievements import *
import json
from datetime import datetime
from push_notifications import send_push_notification




@app.route('/')
def homepage():
    return "hello"

# @app.route('/private/')
# @auth.login_required
# def private_view():
#     # ...
#     user = auth.get_logged_in_user()
#     return user #render_tempate(...)

@app.route('/send_user_message', methods=['POST'])
# @auth.login_required
def send_user_message():

    return send_push_notification(request.json['sender'], request.json['receiver'], request.json['title'], request.json['body'], request.json['type'])


@app.route('/push_steps', methods=['POST'])
# @auth.login_required
def push_steps():
    
    print('push_steps')
        
    query = User.select(
        User.id.alias('user_id'), 
        User.username.alias('user_name'), 
        User.team.alias('team_id'),
        TeamChallenge.id.alias('team_challenge_id'),
        UserChallenge.id.alias('user_challenge_id'),
        TeamChallenge.date.alias('team_challenge_date'),
        UserChallenge.date.alias('user_challenge_date'),
        ).join(TeamChallenge, on=(TeamChallenge.team == User.team)
        ).join(UserChallenge, on=(UserChallenge.user == User.id)
        ).where(
            (User.id == request.json['user_id'])
            & (TeamChallenge.date == datetime.now())
            & (UserChallenge.date == datetime.now())
        )
    print(query.sql())
    print(list(query.dicts()))
    # return json.dumps(list(query.dicts()), default=str)
    team_challenge_id = query.dicts()[0]['team_challenge_id']
    user_challenge_id = query.dicts()[0]['user_challenge_id']
    print(f"{team_challenge_id=}, {user_challenge_id=}")
    
    team_challenge = TeamChallenge.get_by_id(team_challenge_id)
    user_challenge = UserChallenge.get_by_id(user_challenge_id)
    user = User.get_by_id(request.json['user_id'])
    
    steps =  StepCount()
    steps.steps = request.json['steps']
    steps.user = user
    steps.team = user.team
    steps.teamChallenge = team_challenge
    steps.userChallenge = user_challenge
    steps.timestamp = datetime.now()
    steps.save()
    
    return json.dumps(model_to_dict(steps, recurse=False), default=str, indent=4, sort_keys=True)    
    
    
