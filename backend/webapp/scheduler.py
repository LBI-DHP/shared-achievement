import imp
from apscheduler.schedulers.background import BackgroundScheduler

from push_notifications import send_push_notification
from models import User
def schedule_notifications():
    title = "Shared Achievements: Daily Reminder"
    
    type = "DAILY_REMINDER"
    for usr in User.select().where(User.id > 1):
        body = f"""Hi, {usr.username}, 
        you haven't done enough sports today!!!"""
        send_push_notification(sender_user_id=1, receiver_user_id=usr.id, title=title, body=body, type=type)
    print("schedule notifications")


scheduler_notifications = BackgroundScheduler(daemon=True)
scheduler_notifications.add_job(schedule_notifications,'cron',hour=16, minute=16)
scheduler_notifications.start()

