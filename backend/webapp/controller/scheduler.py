
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from controller.push_notifications import send_push_notification
from models import User, Team, UserChallenge, TeamChallenge, ChallengeDifficulty, StepCount
from utils import usr_today, team_today

scheduler = BackgroundScheduler(daemon=True)

def schedule_notifications():
    title = "Shared Achievements: Daily Reminder"
    
    type = "DAILY_REMINDER"
    for usr in User.select().where(User.id > 1):
        userChallenge = UserChallenge.get_or_none((UserChallenge.user == usr) & (UserChallenge.date == usr_today(usr.id)))
        if userChallenge is not None:
            steps = StepCount.get_or_none((StepCount.userChallenge == userChallenge))
            if steps is not None:
                if userChallenge.progress < 100:
                    body = f"Hi {usr.username}, fantastic, you made some progress today! Are you sure you contributed all your steps today?"
                else:
                    body = f"Hi {usr.username}, fantastic, you fulfilled your share today! Keep the spirit up!"        
            else:
                body = f"Hi {usr.username}, you haven't contributed your steps today yet."    
        else:
            body = f"Hi {usr.username}, you haven't contributed your steps today yet."    
        #body = f"""Hi, {usr.username}, you haven't done enough sports today!!!"""
        send_push_notification(sender_user_id=1, receiver_user_id=usr.id, title=title, body=body, type=type)
    print("schedule notifications")



scheduler.add_job(schedule_notifications,'cron',hour=18, minute=1)


# def schedule_create_new_daily_challenges():
#     ### create personal challenges
#     users = (User.select())
#     for user in users:
#         userChallenge = UserChallenge()
#         userChallenge.name = f"{user.username}_daily_challenge"
#         userChallenge.date = datetime.now()
#         userChallenge.goal = user.targetGoal
#         userChallenge.progress = 0
#         userChallenge.user = user
#         userChallenge.save()

#     ### create team challenges
#     teams = (Team.select())
#     for team in teams:
#         teamChallenge = TeamChallenge()
#         teamChallenge.name = 'Untersberg'
#         teamChallenge.goal = int(ChallengeDifficulty.NORMAL)
#         teamChallenge.team = team
#         teamChallenge.date = datetime.now()
#         teamChallenge.save()

# scheduler.add_job(schedule_create_new_daily_challenges,'cron',hour=16, minute=52)
# scheduler.add_job(schedule_create_new_daily_challenges,'cron',hour=0, minute=1)
scheduler.start()