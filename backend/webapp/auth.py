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

"""
auth imports app and models, but none of those import auth
so we're OK
"""
# from flask_peewee.auth import Auth  # Login/logout views, etc.

from app import app, db
from models import User


# auth = Auth(app, db, user_model=User)

from flask_httpauth import HTTPBasicAuth
from werkzeug.security import generate_password_hash, check_password_hash

auth = HTTPBasicAuth()
# Authentication callback
# @auth.verify_password
# def verify_password(username, password):
#     user = User.get(User.username == username)
#     if not user or not user.check_password(password):
#         return False
#     return True



@auth.verify_password
def verify_password(username_or_token, password):
    # first try to authenticate by token
    user = User.verify_auth_token(username_or_token)
    if not user:
        user = User.get_or_none(
                    User.username == username_or_token
                    ) # based on credentials
        if not user or not user.check_password(password):
            return False        
    return True