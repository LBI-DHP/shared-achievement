import datetime
from enum import Enum, unique
import playhouse.signals as signals
from flask_peewee.auth import BaseUser  # provides password helpers..
from peewee import *
from app import db


# TeamChallengeRelationshipDeferred = DeferredThroughModel()
# UserChallengeRelationshipDeferred = DeferredThroughModel()
# TeamAchievementRelationshipDeferred = DeferredThroughModel()
# UserAchievementRelationshipDeferred = DeferredThroughModel()
# UserNotificationRelationshipDeferred = DeferredThroughModel()

class BaseModel(signals.Model):
     class Meta:
        database = db.database


class Team(BaseModel):
    name = CharField()

class User(BaseModel, BaseUser):    
    username = CharField(unique=True)
    password = CharField()
    email = CharField()
    expoToken = CharField()
    team = ForeignKeyField(Team, backref='members',  null=True)
    join_date = DateTimeField(default=datetime.datetime.now())
    active = BooleanField(default=True)
    admin = BooleanField(default=False)
    gender = CharField()
    age = IntegerField()
    weight = IntegerField()
    targetGoal = IntegerField()
    def __unicode__(self):
        return self.username


class ChallengeStatus(Enum):
    NOT_STARTED = -1,
    IN_PROGRESS = 1
    FINISHED = 2



class Challenge(BaseModel): # Abstract class for UserChallenge and TeamChallenge
    name = CharField()
    goal = IntegerField() # Goal in steps
    total_steps = IntegerField() # Goal in steps
    progress = IntegerField() # in percent
    status = CharField(default=ChallengeStatus.NOT_STARTED.name)

class UserChallenge(Challenge):
    date = DateField()    
    user = ForeignKeyField(User)

# class UserChallengeRelationship(BaseModel):
#     user = ForeignKeyField(User)
#     challenge = ForeignKeyField(UserChallenge)

# UserChallengeRelationshipDeferred.set_model(UserChallengeRelationship)


class TeamChallenge(Challenge):
    date = DateField()
    progress = IntegerField()
    team = ForeignKeyField(Team)

# class TeamChallengeRelationship(BaseModel):
#     team = ForeignKeyField(Team)
#     challenge = ForeignKeyField(TeamChallenge)
#     progress = IntegerField()


# TeamChallengeRelationshipDeferred.set_model(TeamChallengeRelationship)


class StepCount(BaseModel):
    steps = IntegerField()
    timestamp = DateTimeField()
    userChallenge = ForeignKeyField(UserChallenge)
    teamChallenge = ForeignKeyField(TeamChallenge)
    user = ForeignKeyField(User)
    team = ForeignKeyField(Team)


class Notification(BaseModel):
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



# class Achievement(BaseModel):
#     name = CharField()
#     progress = IntegerField()
    


# class AchievementUser(Achievement):
#     user = ForeignKeyField(User)



# class AchievementTeam(Achievement):
#     team = ForeignKeyField(Team)

models = [User, Team, StepCount, Notification, UserChallenge, TeamChallenge]
