"""
this is the "secret sauce" -- a single entry-point that resolves the
import dependencies.  If you're using blueprints, you can import your
blueprints here too.

then when you want to run your app, you point to main.py or `main.app`
"""
from random import random
from unicodedata import name
from xmlrpc.client import DateTime
from app import app, db

from auth import *
from admin import admin
from api import api
from models import *
from views import *
from achievements import *
from scheduler import *
from datetime import datetime

admin.setup()
# api.setup()

def create_tables():
    # Create table for each model if it does not exist.
    # Use the underlying peewee database object instead of the
    # flask-peewee database wrapper:
    
    db.database.drop_tables(models)

    db.database.create_tables(models)    
    

def fill_in_data():
    adminUsr = auth.User(username='admin', email='dimi@uni-bremen.de', admin=True, active=True)
    adminUsr.set_password('admin')
    adminUsr.save()

    teamLBI = Team(name='LBI',)
    teamLBI.save()
    
    teamHB = Team(name='Bremen',)
    teamHB.save()

    challengeUntersberg = Challenge()
    challengeUntersberg.name = 'Untersberg'
    challengeUntersberg.steps = 10000
    challengeUntersberg.save()

    users = [('jan', ''), ('eva', 'ExponentPushToken[Iy_BAtIcQN07ZSqppKdtmw]'), ('daniela', ''), ('dimi', "ExponentPushToken[N7zzLwDwLjk6jZOrRmVbzW]")]
    for u in users:
        usr = User()
        usr.username = u[0]
        usr.email = f"{u[0]}@shared-achievement.com"
        usr.set_password(u[0])
        usr.expoToken = u[1]
        usr.team = teamLBI
        usr.save()
        
        for i in range(0,3):
            steps = StepCount()
            steps.user = usr
            steps.steps = 200
            steps.challenge = challengeUntersberg
            steps.timestamp = datetime.now()
            steps.save()

    tcr = TeamChallengeRelationship()
    tcr.challenge = challengeUntersberg
    tcr.team = teamLBI
    tcr.date = datetime.now()
    tcr.save()

if __name__ == '__main__':
    create_tables()
    fill_in_data()
    app.run()