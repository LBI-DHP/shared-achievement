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