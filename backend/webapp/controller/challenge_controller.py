from datetime import datetime
import datetime as dt
import queue
from controller.shared_achievements_logger import logger, logging
from models import User, Team, StepCount,UserChallenge, TeamChallenge, ChallengeStatus, ChallengeDifficulty, TeamProgressCalculationMode, NotificationMessageType
from playhouse.signals import post_save, pre_save
from playhouse.shortcuts import model_to_dict, dict_to_model
from peewee import fn
from controller.push_notifications import send_push_notification
from app import conf, db
from utils import usr_today, team_today
teams_to_update = []


def updateTeamChallengeSteps(teamChallenge:TeamChallenge, contributor:User=None):    
    total_steps = (StepCount.select(fn.SUM(StepCount.steps).alias('total_steps')).where((StepCount.teamChallenge == teamChallenge)).get())
    teamChallenge.total_steps = total_steps.total_steps
    teamChallenge.save()


def updateTeamChallengeProgress(teamChallenge:TeamChallenge, contributor:User=None):
    if teamChallenge.team.progressCalculationMode == TeamProgressCalculationMode.ABSOLUTE.name:           
        teamChallenge.progress = round((float(teamChallenge.total_steps) / max(float(teamChallenge.teamMembersGoal), 1.0)) * 100)
    elif teamChallenge.team.progressCalculationMode == TeamProgressCalculationMode.RELATIVE.name:        
        sumProgress = 0
        for member in teamChallenge.team.members:
            member_total_steps = (StepCount.select(fn.SUM(StepCount.steps).alias('total_steps')).where((StepCount.user == member) & (StepCount.teamChallenge == teamChallenge)).get())
            if member_total_steps.total_steps is None:
                member_total_steps.total_steps = 0
            sumProgress += round(float(member_total_steps.total_steps / member.targetGoal)  * 100)
        teamChallenge.progress = sumProgress / len(teamChallenge.team.members)
    
    if teamChallenge.progress > 0:
        teamChallenge.status = ChallengeStatus.IN_PROGRESS
    
    if teamChallenge.status != ChallengeStatus.FINISHED.name and teamChallenge.progress >= 100:
            teamChallenge.status = ChallengeStatus.FINISHED.name
            msg_title = "Team Challenge Completed"
            msg_body = f"""Awesome, your team reached the summit!!! Keep your spirit up."""
            msg_type = NotificationMessageType.FINISHED_CHALLENGE.name
            send_push_notification(sender_user_id=1, receiver_user_id=contributor.id, title=msg_title, body=msg_body, type=msg_type)

    teamChallenge.save()



def updateUserChallengeProgress(userChallenge:UserChallenge):
    print('---updateUserChallengeProgress')
    total_steps = (StepCount.select(fn.SUM(StepCount.steps).alias('total_steps')).where((StepCount.userChallenge == userChallenge)).get())
    print(total_steps)
    userChallenge.total_steps = total_steps.total_steps
    userChallenge.progress = int(round(float(userChallenge.total_steps / userChallenge.user.targetGoal)  * 100))
    userChallenge.save()

def updateTeamMembersGoal(teamChallenge:TeamChallenge):    
    sumGoal = 0            
    for member in teamChallenge.team.members:        
        sumGoal += member.targetGoal
    teamChallenge.teamMembersGoal = sumGoal
    teamChallenge.goal = sumGoal
    teamChallenge.save()


@post_save(sender=StepCount)
def on_save_steps(sender, instance: StepCount, created):
    print("-----save steps----")
    print("save steps")
    
    logger.log(logging.INFO, f"post save hook for {type(sender)} {created=} user {instance.user} team:{instance.team}")
    contributor = User.get_by_id(instance.user)
    

    ### Notify team about steps contribution
    team_users = User.select(User.id.alias('user_id'), 
                User.username.alias('user_name')
    ).where(
        (User.team == instance.team) & (User.id != instance.user)
    )
    
    msg_title = "New steps contributed"
    for row in list(team_users.dicts()):
        msg_body = ""
        if instance.team.progressCalculationMode == TeamProgressCalculationMode.ABSOLUTE.name:
            msg_body = f"""Awesome! {contributor.username} contributed {instance.steps} steps to your challenge."""
        else:
            progress  = (instance.steps / instance.user.targetGoal) * 100
            msg_body = f"""Awesome! {contributor.username} contributed {int(round(progress))} % to your challenge."""
        msg_type = NotificationMessageType.STEPS_CONTRIBUTION.name
        if instance.steps > conf.MIN_STEPS_TO_PUSH_NOTIFICATION:
            send_push_notification(sender_user_id=contributor.id, receiver_user_id=row['user_id'], title=msg_title, body=msg_body, type=msg_type)
        logger.log(logging.INFO, f"post save hook send mesage to {row}")

    ### Evaluate personal challenge
    ### .....
    userChallenge = (UserChallenge.select().where((UserChallenge.user == contributor) & (UserChallenge.date == usr_today(contributor.id))).get())
    # print(userChallenge)
    total_steps = (StepCount.select(fn.SUM(StepCount.steps).alias('total_steps')).where((StepCount.user == contributor) & (StepCount.userChallenge == userChallenge)).get())
    
    userChallenge.total_steps = total_steps.total_steps
    progress =  round( (float(total_steps.total_steps) / max(float(userChallenge.goal), 1.0) ) * 100)
    userChallenge.status = ChallengeStatus.IN_PROGRESS.name

    userChallenge.progress = progress
    # if progress > 0:
        
    # elif userChallenge.progress >= 100:
    #     userChallenge.status = ChallengeStatus.FINISHED.name
    
    print("-----UC TOTAL STEPS------")
    print(total_steps.total_steps)
    print("-----UC TOTAL Progress------")
    print(progress)
    print("-----UC Status------")
    print(userChallenge.status)

    userChallenge.save()

    if userChallenge.status != ChallengeStatus.FINISHED.name and userChallenge.progress >= 100:
        userChallenge.status = ChallengeStatus.FINISHED.name
        userChallenge.save()
        msg_title = "Personal Challenge achieved"
        msg_body = f"""Awesome, you did it today!!! Keep your spirit up."""
        send_push_notification(sender_user_id=1, receiver_user_id=contributor.id, title=msg_title, body=msg_body, type=msg_type)
    
    

    


@pre_save(sender=User)
def on_user_pre_save(sender, instance: User, created):
    print("on_user_pre_save")
    if instance.team is not None:
        teams_to_update.append(instance.team)
    print(f"{teams_to_update=}")

    
@post_save(sender=User)
def on_user_post_save(sender, instance: User, created):
    print("on_user_post_save")
    # update challenge of old team
    while len(teams_to_update):
        team = teams_to_update.pop()
        print(f"update team challenge for team {team.id}")             
        try:
            teamChallenge = (TeamChallenge.select().where((TeamChallenge.team == team) & (TeamChallenge.date == team_today(team.id))).get())            
            print(teamChallenge.id)
            updateTeamMembersGoal(teamChallenge=teamChallenge)           
            logger.log(logging.INFO, f"updated old team {teamChallenge.team} member goal: {teamChallenge.teamMembersGoal}")
        except Exception as e:
            logger.error(e)

    # update challenge of new team
    if instance.team is not None:
        team = instance.team
        print(f"num users in team {team.id}: {len(team.members)}")
        try:
            teamChallenge = (TeamChallenge.select().where((TeamChallenge.team == team) & (TeamChallenge.date == team_today(team.id))).get())
            print(teamChallenge.id)            
            teamChallenge = teamChallenge.get()
            updateTeamMembersGoal(teamChallenge=teamChallenge)           
            
            logger.log(logging.INFO, f"updated new team {teamChallenge.team} member goal: {teamChallenge.teamMembersGoal}")
        except Exception as e:
            logger.error(e)