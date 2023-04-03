import pytz
import datetime
from models import *


def usr_now(user_id):
    usr = User.get_by_id(user_id)
    usr_now = datetime.datetime.now(usr.timezone)
    return usr_now

def team_now(team_id):
    team = Team.get_by_id()
    team_now = datetime.datetime.now(team.timezone)
    return team_now

def usr_today(user_id):
    usr = User.get_by_id(user_id)
    usr_today = datetime.datetime.now(usr.timezone).date()
    return usr_today

def team_today(team_id):
    team = Team.get_by_id()
    team_today = datetime.datetime.now(team.timezone).date()
    return team_today