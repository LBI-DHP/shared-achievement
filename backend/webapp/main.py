"""
this is the "secret sauce" -- a single entry-point that resolves the
import dependencies.  If you're using blueprints, you can import your
blueprints here too.

then when you want to run your app, you point to main.py or `main.app`
"""
import logging
from random import random
from unicodedata import name
from xmlrpc.client import DateTime
from app import app, db

from auth import *
from admin import admin
from api import api
from models import *
from views import *
from controller.shared_achievements_logger import configure_logging, logger
from controller.challenge_controller import *
from achievements import *
from controller.scheduler import *
# from datetime import datetime
import datetime

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

    challengeUntersberg = TeamChallenge()
    challengeUntersberg.name = 'Untersberg'
    challengeUntersberg.goal = 10000
    challengeUntersberg.team = teamLBI
    challengeUntersberg.date = datetime.date.today() - datetime.timedelta(days=1) #datetime.now() 
    challengeUntersberg.save()


    challengeGaisberg = TeamChallenge()
    challengeGaisberg.name = 'Gaisberg'
    challengeGaisberg.goal = 5000
    challengeGaisberg.team = teamLBI
    challengeGaisberg.date = datetime.datetime.now()
    challengeGaisberg.save()
    

    challengeKlockerin = TeamChallenge()
    challengeKlockerin.name = 'Klockerin'
    challengeKlockerin.goal = 5000
    challengeKlockerin.team = teamHB
    challengeKlockerin.date = datetime.datetime.now()
    challengeKlockerin.save()

    # tcr = TeamChallengeRelationship()
    # tcr.challenge = challengeUntersberg
    # tcr.team = teamLBI    
    # tcr.save()

    users = [
        ('jan', 'NO_TOKEN'), 
        ('eva', 'ExponentPushToken[Iy_BAtIcQN07ZSqppKdtmw]'), 
        ('daniela', 'NO_TOKEN'), 
        ('dimi', "ExponentPushToken[N7zzLwDwLjk6jZOrRmVbzW]"), 
        ('testy', 'NO_TOKEN')
    ]
    for u in users:
        usr = User()
        usr.username = u[0]
        usr.email = f"{u[0]}@shared-achievement.com"
        usr.set_password(u[0])
        usr.expoToken = u[1]
        usr.team = teamLBI
        usr.save()
        
        userChallenge = UserChallenge()
        userChallenge.name = f"{usr.username}_daily_challenge"
        userChallenge.date = datetime.datetime.now()
        userChallenge.goal = 1000
        userChallenge.progress = 0
        userChallenge.user = usr
        userChallenge.save()

        for i in range(0,1):
            steps = StepCount()
            steps.user = usr
            steps.team = usr.team
            steps.steps = 200
            steps.teamChallenge = challengeUntersberg
            steps.userChallenge = userChallenge
            steps.timestamp = datetime.datetime.now()
            steps.save()



if __name__ == '__main__':
    configure_logging()
    logger.log(logging.INFO, "test logger")
    create_tables()
    fill_in_data()
    #app.run(host="0.0.0.0", port=11883)
    app.run(host="0.0.0.0", port=11883)