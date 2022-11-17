import datetime
from email.policy import default
from enum import Enum, IntEnum, unique
import playhouse.signals as signals
from flask_peewee.auth import BaseUser  # provides password helpers..
from peewee import *
from app import db


# TeamChallengeRelationshipDeferred = DeferredThroughModel()
# UserChallengeRelationshipDeferred = DeferredThroughModel()
# TeamAchievementRelationshipDeferred = DeferredThroughModel()
# UserAchievementRelationshipDeferred = DeferredThroughModel()
# UserNotificationRelationshipDeferred = DeferredThroughModel()

class ChallengeDifficulty(IntEnum):
    EASY = 8000,
    NORMAL = 10000,
    HARD = 15000,
    EXPERT = 20000

class BaseModel(signals.Model):
     class Meta:
        database = db.database

class TeamProgressCalculationMode(Enum):
    ABSOLUTE = 0, # Use the static goal from challenge multiplied by number of team members
    RELATIVE = 1  # Use personal goals for team challenge progress

class Team(BaseModel):
    name = CharField()
    progressCalculationMode = CharField(default=TeamProgressCalculationMode.ABSOLUTE.name)
    hidden = BooleanField(default=False)

class User(BaseModel, BaseUser):    
    username = CharField(unique=True)
    password = CharField()
    uniqueDeviceId = CharField(unique=False)
    email = CharField()
    expoToken = CharField()
    team = ForeignKeyField(Team, backref='members',  null=True)
    join_date = DateTimeField(default=datetime.datetime.now())
    active = BooleanField(default=True)
    admin = BooleanField(default=False)
    showDeveloperSettings = BooleanField(default=False)
    device = CharField()
    operatingSystem = CharField()
    operatingSystemVersion = CharField()    
    currentActivityLevel = IntegerField()
    targetGoal = IntegerField(default=int(ChallengeDifficulty.NORMAL))
    averageSteps = IntegerField(default=0)    
    
    def __unicode__(self):
        return self.username

class UserStudyResponse(BaseModel):
    user = ForeignKeyField(User)
    consent = BooleanField(default=False)
    timestamp = DateTimeField(default=datetime.datetime.now())


class ChallengeStatus(Enum):
    NOT_STARTED = -1,
    IN_PROGRESS = 1
    FINISHED = 2




class Challenge(BaseModel): # Abstract class for UserChallenge and TeamChallenge
    name = CharField()
    goal = IntegerField(default=int(ChallengeDifficulty.NORMAL)) # base Goal in steps
    total_steps = IntegerField(default=0) #  number of steps contributed to this challenge
    progress = IntegerField(default=0) # progress in percent
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
    team = ForeignKeyField(Team)
    teamMembersGoal = IntegerField() # total goal for all team members

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

models = [User, UserStudyResponse, Team, StepCount, Notification, UserChallenge, TeamChallenge]
