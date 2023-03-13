import pytz
import datetime
from models import *

def usr_today(user_id):
    usr = User.get_by_id(user_id)
    usr_today = datetime.datetime.now(usr.timezone).date()
    return usr_today

def team_today(team_id):
    team = Team.get_by_id()
    team_today = datetime.datetime.now(team.timezone).date()
    return team_today