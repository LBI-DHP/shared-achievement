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
    teamLBI.progressCalculationMode = TeamProgressCalculationMode.RELATIVE.name
    teamLBI.save()
    
    teamHB = Team(name='Bremen',)
    teamHB.progressCalculationMode = TeamProgressCalculationMode.ABSOLUTE.name
    teamHB.save()

    challengeGaisberg = TeamChallenge()
    challengeGaisberg.name = 'Gaisberg'
    challengeGaisberg.goal = int(ChallengeDifficulty.NORMAL)
    challengeGaisberg.team = teamLBI
    challengeGaisberg.date = datetime.date.today() - datetime.timedelta(days=1) #datetime.now() 
    challengeGaisberg.save()


    challengeUntersberg = TeamChallenge()
    challengeUntersberg.name = 'Untersberg'    
    challengeUntersberg.goal = int(ChallengeDifficulty.NORMAL)
    challengeUntersberg.team = teamLBI
    challengeUntersberg.date = datetime.datetime.now()
    challengeUntersberg.save()
    

    challengeKlockerin = TeamChallenge()
    challengeKlockerin.name = 'Klockerin'
    challengeKlockerin.goal = int(ChallengeDifficulty.EASY)
    challengeKlockerin.team = teamHB
    challengeKlockerin.date = datetime.datetime.now()
    challengeKlockerin.save()

    # tcr = TeamChallengeRelationship()
    # tcr.challenge = challengeUntersberg
    # tcr.team = teamLBI    
    # tcr.save()

    user_data = [
        {'username': 'jan', 'email': 'jan@shared-achievement.com', 'expoToken': 'NO_TOKEN', 'team': teamLBI, 'targetGoal': int(ChallengeDifficulty.EASY)},
        {'username': 'eva', 'email': 'eva@shared-achievement.com', 'expoToken': 'ExponentPushToken[Iy_BAtIcQN07ZSqppKdtmw]', 'team': teamLBI, 'targetGoal': int(ChallengeDifficulty.HARD)},
        {'username': 'daniela', 'email': 'daniela@shared-achievement.com', 'expoToken': 'NO_TOKEN', 'team': teamLBI, 'targetGoal': int(ChallengeDifficulty.NORMAL)},
        {'username': 'dimi', 'email': 'dimi@shared-achievement.com', 'expoToken': 'ExponentPushToken[N7zzLwDwLjk6jZOrRmVbzW]', 'team': teamHB, 'targetGoal': int(ChallengeDifficulty.NORMAL)},
        {'username': 'susanne', 'email': 'susanne@shared-achievement.com', 'expoToken': 'NO_TOKEN', 'team': teamHB, 'targetGoal': int(ChallengeDifficulty.NORMAL)},
    ]

    User.insert_many(user_data).execute()

    users = User.select().where(~User.team.is_null()).execute()

    for u in users:
        
        userChallenge = UserChallenge()
        userChallenge.name = f"{u.username}_daily_challenge"
        userChallenge.date = datetime.datetime.now()
        userChallenge.goal = u.targetGoal
        userChallenge.progress = 0
        userChallenge.user = u
        userChallenge.save()

        for i in range(0,1):
            steps = StepCount()
            steps.user = u
            steps.team = u.team
            steps.steps = u.targetGoal * 0.1 #int(ChallengeDifficulty.NORMAL) * 0.5
            steps.teamChallenge = challengeUntersberg
            steps.userChallenge = userChallenge
            steps.timestamp = datetime.datetime.now()
            steps.save()





if __name__ == '__main__':
    configure_logging()
    logger.log(logging.INFO, "start logger")
    create_tables()
    fill_in_data()
    #app.run()
    # app.run(port=11883)
    app.run(host="0.0.0.0", port=11883)