import datetime

def usr_now(user_id):
    from models import User    
    usr = User.get_by_id(user_id)
    tz = datetime.timezone(offset=datetime.timedelta(days=0, seconds=0,hours=usr.timezone_offset), name=usr.timezone)
    usr_now = datetime.datetime.now(tz)
    return usr_now

def team_now(team_id):
    from models import Team
    team = Team.get_by_id(team_id)
    tz = datetime.timezone(offset=datetime.timedelta(days=0, seconds=0,hours=team.timezone_offset), name=team.timezone)
    team_now = datetime.datetime.now(team.tz)
    return team_now

def usr_today(user_id):
    from models import User    
    usr = User.get_by_id(user_id)
    tz = datetime.timezone(offset=datetime.timedelta(days=0, seconds=0,hours=usr.timezone_offset), name=usr.timezone)
    #tz =datetime.tzinfo.tzname(usr.timezone)
    print(tz)
    date = datetime.datetime.now(tz=tz).date()
    return date

def team_today(team_id):
    from models import Team    
    team = Team.get_by_id(team_id)    
    tz = datetime.timezone(offset=datetime.timedelta(days=0, seconds=0,hours=team.timezone_offset), name=team.timezone)
    date = datetime.datetime.now(tz=tz).date()
    return date
