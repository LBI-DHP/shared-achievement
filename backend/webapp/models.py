# Copyright (c) 2021-2024 Ludwig Boltzmann Institute for Digital Health and Prevention
#
# Licensed under the Apache License, Version 2.0 with the Commons Clause License
# Condition v1.0 (the "License"); you may not use this file except in compliance
# with the License. A copy of the License is distributed in the LICENSE file at
# the root of this repository; the Apache License is also available at
# http://www.apache.org/licenses/LICENSE-2.0 and the Commons Clause condition at
# https://commonsclause.com/
#
# Unless required by applicable law or agreed to in writing, software distributed
# under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
# CONDITIONS OF ANY KIND, either express or implied. See the License for the
# specific language governing permissions and limitations under the License.
#
# SPDX-License-Identifier: LicenseRef-Apache-2.0-WITH-Commons-Clause

import pytz
import datetime
from email.policy import default
from enum import Enum, IntEnum, unique

from flask_peewee.auth import BaseUser  # provides password helpers..
from peewee import *
from app import db, app
from utils import usr_today, team_today
from itsdangerous import *


from playhouse.signals import Model as SignalsModel # Important for @post_saveSignals

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

class BaseModel(SignalsModel):
     class Meta:
        database = db.database

class TeamProgressCalculationMode(Enum):
    ABSOLUTE = 0, # Use the static goal from challenge multiplied by number of team members
    RELATIVE = 1  # Use personal goals for team challenge progress

class Team(BaseModel):
    name = CharField()
    progressCalculationMode = CharField(default=TeamProgressCalculationMode.ABSOLUTE.name)
    hidden = BooleanField(default=False)
    timezone = CharField()
    timezone_offset = IntegerField(default=0)

class User(BaseModel, BaseUser):    
    username = CharField(unique=True)
    password = CharField()
    uniqueDeviceId = CharField(unique=False)
    email = CharField()
    expoToken = CharField()
    team = ForeignKeyField(Team, backref='members',  null=True)
    isSingleUser = BooleanField(default=True)
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
    timezone = CharField()
    timezone_offset = IntegerField(default=0)
    
    def __unicode__(self):
        return self.username
    

    def generate_auth_token(self):
        s = Serializer(
               secret_key=app.config['SECRET_KEY'],
               #salt=self.username               
               )
        
        return s.dumps(self.id)
    

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(app.config['SECRET_KEY'])        
        try:
            data = s.loads(token)
        except SignatureExpired:
            print("signature Expired")
            return None  # valid token, but expired
        except BadSignature:
            print("Bad signature")
            return None  # invalid token
        user = User.get_or_none(User.id == data)
        return user
    

class UserStudyResponse(BaseModel):
    user = ForeignKeyField(User)
    consent = BooleanField(default=False)    
    server_timestamp = DateTimeField(default=datetime.datetime.now())
    usr_timestamp  = DateTimeField()
    team_timestamp  = DateTimeField()


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
    server_timestamp = DateTimeField()
    usr_timestamp  = DateTimeField()
    team_timestamp  = DateTimeField()
    userChallenge = ForeignKeyField(UserChallenge)
    teamChallenge = ForeignKeyField(TeamChallenge)
    user = ForeignKeyField(User)
    team = ForeignKeyField(Team)


class NotificationMessageType(Enum):    
    STEPS_CONTRIBUTION = 1
    FINISHED_CHALLENGE = 2

class Notification(BaseModel):
    title = CharField()
    body = CharField()
    type = CharField()
    status = CharField()
    sender = ForeignKeyField(User, null=True)
    receiver = ForeignKeyField(User)
    server_timestamp = DateTimeField()
    usr_timestamp  = DateTimeField()    
    

# class UserNotificationRelationship(db.Model):
#     sender = ForeignKeyField(User)
#     receiver = ForeignKeyField(User)
#     notification =ForeignKeyField(Notification)
#     server_timestamp = DateTimeField()

# UserNotificationRelationshipDeferred.set_model(UserNotificationRelationship)



# class Achievement(BaseModel):
#     name = CharField()
#     progress = IntegerField()
    


# class AchievementUser(Achievement):
#     user = ForeignKeyField(User)



# class AchievementTeam(Achievement):
#     team = ForeignKeyField(Team)

models = [User, UserStudyResponse, Team, StepCount, Notification, UserChallenge, TeamChallenge]
