"""
views imports app, auth, and models, but none of these import views
"""
from crypt import methods
import imp
from unicodedata import name
from flask import Response, jsonify, render_template, request  # ...etc , redirect, request, url_for
from playhouse.shortcuts import model_to_dict, dict_to_model
from sqlalchemy import null
from app import app
from auth import auth
from models import *
from achievements import *
import json
from datetime import datetime
from controller.push_notifications import send_push_notification




@app.route('/')
def homepage():
    return "hello"


@app.route('/register', methods=['POST'])
def register_user():
    existingUsr = (User.select(fn.Count(User.id).alias('count_ids')).where(User.username == request.json['username']).get())
    
    if existingUsr.count_ids > 0:
        return 'Username already exists', 409
    

    usr = User()
    usr.username = request.json['username']
    usr.set_password(request.json['password'])        
    usr.expoToken = request.json['expoToken']
    usr.active = True
    usr.admin = True
    usr.save()

    res = model_to_dict(usr, recurse=False, exclude=['password',"email"])
    del res['password']
    del res['email']
    print(res)
    return jsonify(res) 
    #return json.dumps(model_to_dict(usr, recurse=False, exclude=['password']), default=str, indent=4, sort_keys=True)    



@app.route('/stepcounttoday/user/<user_id>', methods=['GET'])
def stepcount_today_user(user_id):
    userChallenge, created = UserChallenge.get_or_create(user=user_id, date=datetime.now())
    if created:
        userChallenge.save()
        res = {'total_steps': 0}
    # userChallenge = (UserChallenge.select().where((UserChallenge.user == user_id) & (UserChallenge.date == datetime.now())).get())    
    total_steps = (StepCount.select(fn.SUM(StepCount.steps).alias('total_steps')).where((StepCount.user == user_id) & (StepCount.userChallenge == userChallenge)).get())    
    res = {'total_steps': total_steps.total_steps}
    return jsonify(res) #json.dumps(res, default=str, indent=4, sort_keys=True)


@app.route('/stepcounttoday/team/<team_id>', methods=['GET'])
def stepcount_today_team(team_id):
    teamChallenge, created = TeamChallenge.get_or_create(team=team_id, date=datetime.now())
    team = team.get_by_id(team_id) 
    teamChallenge.teamMembersGoal = teamChallenge.goal * len(team.members)
    teamChallenge.save()

    if created:
        
        res = {'total_steps': 0}
        return jsonify(res)    
    # teamChallenge = (TeamChallenge.select().where((TeamChallenge.team == team_id) & (TeamChallenge.date == datetime.now())).get())    
    total_steps = (StepCount.select(fn.SUM(StepCount.steps).alias('total_steps')).where((StepCount.team == team_id) & (StepCount.teamChallenge == teamChallenge)).get())    
    
    if total_steps.total_steps is None:
        total_steps.total_steps = 0
    res = {'total_steps': total_steps.total_steps}
    return jsonify(res) # json.dumps(res, default=str, indent=4, sort_keys=True)


# @app.route('/private/')
# @auth.login_required
# def private_view():
#     # ...
#     user = auth.get_logged_in_user()
#     return user #render_tempate(...)


# @app.route('/team/<team_id>')
# def get_team(team_id):
#     team = (Team.get_by_id(team_id))
#     # d = model_to_dict(team, backrefs=True)
#     members = list(team.members.dicts())
#     # print(members)
#     return json.dumps(members, default=str, indent=4, sort_keys=True)    

@app.route('/send_user_message', methods=['POST'])
# @auth.login_required
def send_user_message():

    return send_push_notification(request.json['sender'], request.json['receiver'], request.json['title'], request.json['body'], request.json['type'])


@app.route('/push_steps', methods=['POST'])
# @auth.login_required
def push_steps():
    
    print('push_steps')

    user = User.get_by_id(request.json['user_id'])
    if user is None:
        return "User does not exist", 404

    userChallenge, created = UserChallenge.get_or_create(user=user.id, date=datetime.now())
    if created:
        userChallenge.save()

    
        
    teamChallenge, created = TeamChallenge.get_or_create(team=user.team, date=datetime.now())
    if created:
        teamChallenge.save()


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
            (User.id == user.id)
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
    
    steps =  StepCount()
    steps.steps = request.json['steps']
    steps.user = user
    steps.team = user.team
    steps.teamChallenge = team_challenge
    steps.userChallenge = user_challenge
    steps.timestamp = datetime.now()
    steps.save()
    
    return Response(json.dumps(model_to_dict(steps, recurse=False), default=str, indent=4, sort_keys=True), mimetype='application/json')    
    
    
