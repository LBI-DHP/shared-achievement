from models import User, Notification, StepCount
from playhouse.signals import post_save

from controller.push_notifications import send_push_notification

@post_save(sender=StepCount)
def on_save_steps(sender, instance: StepCount, created):
    print(sender)
    print(f"post save hook user {instance.user} team:{instance.team}")
    print(created)
    contributor = User.get_by_id(instance.user)
    team_users = User.select(User.id.alias('user_id'), 
                User.username.alias('user_name')
    ).where(
        User.team == instance.team
    )
    
    msg_title = "New steps contributed"
    for row in list(team_users.dicts()):
        msg_body = f"""Awesome! {contributor.username} contributed {instance.steps} to your challenge."""
        msg_type = 'STEPS_CONTRIBUTION'
        send_push_notification(sender_user_id=contributor.id, receiver_user_id=row['user_id'], title=msg_title, body=msg_body, type=msg_type)
        print(row)
    