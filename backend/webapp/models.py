import datetime
from enum import unique

from flask_peewee.auth import BaseUser  # provides password helpers..
from peewee import *

from app import db


TeamChallengeRelationshipDeferred = DeferredThroughModel()
UserChallengeRelationshipDeferred = DeferredThroughModel()
# TeamAchievementRelationshipDeferred = DeferredThroughModel()
# UserAchievementRelationshipDeferred = DeferredThroughModel()
# UserNotificationRelationshipDeferred = DeferredThroughModel()


class Team(db.Model):
    name = CharField()

class User(db.Model, BaseUser):    
    username = CharField()
    password = CharField()
    email = CharField()
    expoToken = CharField()
    team = ForeignKeyField(Team, backref='members',  null=True)
    join_date = DateTimeField(default=datetime.datetime.now)
    active = BooleanField(default=True)
    admin = BooleanField(default=False)
    gender = CharField()
    age = IntegerField()
    weight = IntegerField()
    targetGoal = IntegerField()
    def __unicode__(self):
        return self.username



class Challenge(db.Model):
    name = CharField()
    goal = IntegerField()



class TeamChallengeRelationship(db.Model):
    team = ForeignKeyField(Team)
    challenge = ForeignKeyField(Challenge)
    date = DateField()
    progress = IntegerField()


TeamChallengeRelationshipDeferred.set_model(TeamChallengeRelationship)
    

class UserChallengeRelationship(db.Model):
    user = ForeignKeyField(User)
    challenge = ForeignKeyField(Challenge)
    date = DateField()
    progress = IntegerField()


UserChallengeRelationshipDeferred.set_model(UserChallengeRelationship)

class StepCount(db.Model):
    steps = IntegerField()
    timestamp = DateTimeField()
    challenge = ForeignKeyField(Challenge)
    user = ForeignKeyField(User)


class Notification(db.Model):
    title = CharField()
    body = CharField()
    type = CharField()
    status = CharField()
    sender = ForeignKeyField(User, null=True)
    receiver = ForeignKeyField(User)
    timestamp = DateTimeField()    
    

# class UserNotificationRelationship(db.Model):
#     sender = ForeignKeyField(User)
#     receiver = ForeignKeyField(User)
#     notification =ForeignKeyField(Notification)
#     timestamp = DateTimeField()

# UserNotificationRelationshipDeferred.set_model(UserNotificationRelationship)



# class Achievement(db.Model):
#     name = CharField()
#     progress = IntegerField()
    


# class AchievementUser(Achievement):
#     user = ForeignKeyField(User)



# class AchievementTeam(Achievement):
#     team = ForeignKeyField(Team)

models = [User, Challenge, Team, StepCount, Notification, TeamChallengeRelationship, UserChallengeRelationship]
