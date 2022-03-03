
import imp
import httplib2
import json
from models import User, Notification, StepCount
from playhouse.signals import post_save
from datetime import datetime
NOTIFICATION_URL = "https://exp.host/--/api/v2/push/send"


def send_push_notification(sender_user_id:int, receiver_user_id:int, title:str, body:str, type:str):
    httpSocket = httplib2.Http()
    receiverToken = User.get_by_id(receiver_user_id).expoToken
    
    push_notification_obj = {
        'to': receiverToken,
        'title': title,
        'body': body
    }

    push_notification_json = json.dumps(push_notification_obj)    
    headers, resp = httpSocket.request(NOTIFICATION_URL, 'POST', body=push_notification_json, headers={'content-type':'application/json'})    
    response = json.loads(resp)

    msg = Notification()
    msg.title = title
    msg.body = body
    msg.type = type
    msg.sender = sender_user_id
    msg.receiver = receiver_user_id
    msg.timestamp = datetime.now()
    msg.status =  headers['status']
    msg.save()

    httpSocket.close()
    return response# headers['status'] #json.dumps(model_to_dict(msg), default=str)


@post_save(sender=StepCount)
def on_save_steps(sender, instance: StepCount, created):
    print("post save hook")
    team_users = User.select(User.id.alias('user_id'), 
                User.username.alias('user_name')
    ).where(
        User.team == instance.team
    )
    