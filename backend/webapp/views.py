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
    # return "push"    
    query = User.select(
        User.id.alias('user_id'), 
        User.team.alias('team_id'),
        Challenge.id.alias('challenge_id'),
        TeamChallengeRelationship.date.alias('challenge_date')).join(Challenge, on=(Challenge.id == User.team)
        ).join(TeamChallengeRelationship, on=(TeamChallengeRelationship.challenge == Challenge.id)).where(
            (User.id == request.json['user_id'])
            & (TeamChallengeRelationship.date == datetime.now())
        )
    
    challenge_id = query.dicts()[0]['challenge_id']
    print(f"{challenge_id=}")
    
    challenge = Challenge.get_by_id(challenge_id)
    user = User.get_by_id(request.json['user_id'])
    
    steps =  StepCount()
    steps.steps = request.json['steps']
    steps.user = user
    steps.challenge = challenge
    steps.timestamp = datetime.now()
    steps.save()
    
    return json.dumps(model_to_dict(steps, recurse=False), default=str, indent=4, sort_keys=True)    
    
    
