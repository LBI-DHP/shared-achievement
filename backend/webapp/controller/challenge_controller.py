from datetime import datetime
import datetime as dt
import queue
from controller.shared_achievements_logger import logger, logging
from models import User, Team, StepCount,UserChallenge, TeamChallenge, ChallengeStatus, ChallengeDifficulty, TeamProgressCalculationMode
from playhouse.signals import post_save, pre_save
from playhouse.shortcuts import model_to_dict, dict_to_model
from peewee import fn
from controller.push_notifications import send_push_notification

teams_to_update = []


def updateTeamChallengeProgress(teamChallenge:TeamChallenge):
    if teamChallenge.team.progressCalculationMode == TeamProgressCalculationMode.ABSOLUTE.name:           
        teamChallenge.progress = round((float(teamChallenge.total_steps) / max(float(teamChallenge.teamMembersGoal), 1.0)) * 100)
    elif teamChallenge.team.progressCalculationMode == TeamProgressCalculationMode.RELATIVE.name:        
        sumProgress = 0
        for member in teamChallenge.team.members:
            member_total_steps = (StepCount.select(fn.SUM(StepCount.steps).alias('total_steps')).where((StepCount.user == member) & (StepCount.teamChallenge == teamChallenge)).get())
            if member_total_steps.total_steps is None:
                member_total_steps.total_steps = 0
            sumProgress += round(float(member_total_steps.total_steps / member.targetGoal) * 100)
        teamChallenge.progress = sumProgress
    teamChallenge.save()


def updateTeamMembersGoal(teamChallenge:TeamChallenge):
    if teamChallenge.team.progressCalculationMode == TeamProgressCalculationMode.ABSOLUTE.name:
        teamChallenge.goal = int(ChallengeDifficulty.NORMAL)
        teamChallenge.teamMembersGoal = teamChallenge.goal * len(teamChallenge.team.members)
    elif teamChallenge.team.progressCalculationMode == TeamProgressCalculationMode.RELATIVE.name:
        teamChallenge.goal = -1            
        for member in teamChallenge.team.members:
            teamChallenge.teamMembersGoal += member.targetGoal
    teamChallenge.save()

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
    userChallenge = (UserChallenge.select().where((UserChallenge.user == contributor) & (UserChallenge.date == dt.date.today())).get())
    # print(userChallenge)
    total_steps = (StepCount.select(fn.SUM(StepCount.steps).alias('total_steps')).where((StepCount.user == contributor) & (StepCount.userChallenge == userChallenge)).get())
    print(total_steps.total_steps)
    userChallenge.total_steps = total_steps.total_steps 
    userChallenge.progress = round( (float(total_steps.total_steps) / max(float(userChallenge.goal), 1.0) ) * 100)
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
    teamChallenge = (TeamChallenge.select().where((TeamChallenge.team == contributor.team) & (TeamChallenge.date == dt.date.today())).get())
    # print ("--------------------S")
    # logger.log(logging.INFO, teamChallenge.members)
    # print ("--------------------E")
    total_steps = (StepCount.select(fn.SUM(StepCount.steps).alias('total_steps')).where((StepCount.teamChallenge == teamChallenge)).get())
    teamChallenge.total_steps = total_steps.total_steps
    if total_steps.total_steps is None:
        total_steps.total_steps = 0
    updateTeamMembersGoal(teamChallenge=teamChallenge)
    updateTeamChallengeProgress(teamChallenge=teamChallenge)

    
    if teamChallenge.status != ChallengeStatus.FINISHED.name and teamChallenge.progress >= 100:
        teamChallenge.status = ChallengeStatus.FINISHED.name
        msg_title = "Team Challenge Completed"
        msg_body = f"""Awesome, you did it today!!! Keep your spirit up."""
        send_push_notification(sender_user_id=1, receiver_user_id=contributor.id, title=msg_title, body=msg_body, type=msg_type)
    else:
        teamChallenge.status = ChallengeStatus.IN_PROGRESS.name
    teamChallenge.save()


@pre_save(sender=User)
def on_user_pre_save(sender, instance: User, created):
    if instance.team is not None:
        teams_to_update.append(instance.team)
    print(f"{teams_to_update=}")

    
@post_save(sender=User)
def on_user_post_save(sender, instance: User, created):
    # update challenge of old team
    while len(teams_to_update):
        team = teams_to_update.pop()
        print(f"update team challenge for team {team.id}")             
        try:
            teamChallenge = (TeamChallenge.select().where((TeamChallenge.team == team) & (TeamChallenge.date == dt.date.today())).get())            
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
            teamChallenge = (TeamChallenge.select().where((TeamChallenge.team == team) & (TeamChallenge.date == datetime.now())).get())
            print(teamChallenge.id)            
            teamChallenge = teamChallenge.get()
            updateTeamMembersGoal(teamChallenge=teamChallenge)           
            
            logger.log(logging.INFO, f"updated new team {teamChallenge.team} member goal: {teamChallenge.teamMembersGoal}")
        except Exception as e:
            logger.error(e)