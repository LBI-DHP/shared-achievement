# Copyright (c) 2021-2024 Ludwig Boltzmann Institute for Digital Health and Prevention
#
# Licensed under the Apache License, Version 2.0 with the Commons Clause License
# Condition v1.0 (the "License"); you may not use this file except in compliance
# with the License. A copy of the License is distributed in the LICENSE file at
# the root of this repository; the Apache License is also available at
# http://www.apache.org/licenses/LICENSE-2.0 and the Commons Clause condition at
# https://commonsclause.com/
#
# Unless required by applicable law or agreed to in writing, software distributed
# under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
# CONDITIONS OF ANY KIND, either express or implied. See the License for the
# specific language governing permissions and limitations under the License.
#
# SPDX-License-Identifier: LicenseRef-Apache-2.0-WITH-Commons-Clause


from controller.shared_achievements_logger import logger, logging
import imp
import httplib2
import json
from models import User, Notification
from playhouse.signals import post_save
from datetime import datetime
NOTIFICATION_URL = "https://exp.host/--/api/v2/push/send"


def send_push_notification(sender_user_id:int, receiver_user_id:int, title:str, body:str, type:str):
    logger = logging.getLogger('SHARED_ACHIEVEMENTS_LOGGER')
    httpSocket = httplib2.Http()
    receiverToken = User.get_by_id(receiver_user_id).expoToken
    
    push_notification_obj = {
        'to': receiverToken,
        'title': title,
        'body': body
    }

    push_notification_json = json.dumps(push_notification_obj)    
    headers, resp = httpSocket.request(NOTIFICATION_URL, 'POST', body=push_notification_json, headers={'content-type':'application/json'})
    
    res = ''

    try:        
        response = json.loads(resp)
        res = response
    except Exception as e:
        logger.error(e)
        res = headers['status']   

    msg = Notification()
    msg.title = title
    msg.body = body
    msg.type = type
    msg.sender = sender_user_id
    msg.receiver = receiver_user_id
    msg.server_timestamp = datetime.now()    
    msg.usr_timestamp
    msg.status =  headers['status']
    msg.save()

    httpSocket.close()
    return res #response# headers['status'] #json.dumps(model_to_dict(msg), default=str)

