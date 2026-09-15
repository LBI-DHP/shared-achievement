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
    team_now = datetime.datetime.now(tz)
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
