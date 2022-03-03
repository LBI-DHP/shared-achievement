from datetime import datetime
from controller.shared_achievements_logger import logger, logging
from models import User, StepCount,UserChallenge, TeamChallenge, ChallengeStatus
from playhouse.signals import post_save
from playhouse.shortcuts import model_to_dict, dict_to_model
from peewee import fn
from controller.push_notifications import send_push_notification



@post_save(sender=StepCount)
def on_save_steps(sender, instance: StepCount, created):

    
    logger.log(logging.INFO, f"post save hook for {type(sender)} {created=} user {instance.user} team:{instance.team}")
    contributor = User.get_by_id(instance.user)
    

    ### Notify team about steps contribution
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
        logger.log(logging.INFO, f"post save hook send mesage to {row}")

    ### Evaluate personal challenge
    ### .....
    userChallenge = (UserChallenge.select().where((UserChallenge.user == contributor) & (UserChallenge.date == datetime.now())).get())
    # print(userChallenge)
    total_steps = (StepCount.select(fn.SUM(StepCount.steps).alias('total_steps')).where((StepCount.user == contributor) & (StepCount.userChallenge == userChallenge)).get())
    print(total_steps.total_steps)
    userChallenge.total_steps = total_steps.total_steps 
    userChallenge.progress = (total_steps.total_steps / userChallenge.goal) * 100
    if userChallenge.status != ChallengeStatus.FINISHED.name and userChallenge.progress >= 100:
        userChallenge.status = ChallengeStatus.FINISHED.name
        msg_title = "Personal Challenge achieved"
        msg_body = f"""Awesome, you did it today!!! Keep your spirit up."""
        send_push_notification(sender_user_id=1, receiver_user_id=contributor.id, title=msg_title, body=msg_body, type=msg_type)
    else:    
        userChallenge.status = ChallengeStatus.IN_PROGRESS.name
    userChallenge.save()
    

    ### Evaluate team challenge
    ### .....
    teamChallenge = (TeamChallenge.select().where((TeamChallenge.team == contributor.team) & (TeamChallenge.date == datetime.now())).get())
    total_steps = (StepCount.select(fn.SUM(StepCount.steps).alias('total_steps')).where((StepCount.teamChallenge == teamChallenge)).get())
    teamChallenge.total_steps = total_steps.total_steps
    teamChallenge.progress = (total_steps.total_steps / teamChallenge.goal) * 100
    if teamChallenge.status != ChallengeStatus.FINISHED.name and teamChallenge.progress >= 100:
        teamChallenge.status = ChallengeStatus.FINISHED.name
        msg_title = "Team Challenge Completed"
        msg_body = f"""Awesome, you did it today!!! Keep your spirit up."""
        send_push_notification(sender_user_id=1, receiver_user_id=contributor.id, title=msg_title, body=msg_body, type=msg_type)
    else:
        teamChallenge.status = ChallengeStatus.IN_PROGRESS.name
    teamChallenge.save()

    
    