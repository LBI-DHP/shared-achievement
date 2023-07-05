"""
api imports app, auth and models, but none of these import api.
"""
from flask_peewee.rest import RestAPI, RestResource, Authentication, UserAuthentication
from flask import g
#from flask import redirect
from flask import request

from app import app
from auth import auth
from models import User
from models import models
# from models import Team

#user_auth = UserAuthentication(auth, protected_methods=['GET', 'PUT', 'POST', 'DELETE', 'PATCH'])


class CustomUserAuthentication(Authentication):
    def __init__(self, auth, protected_methods=None):
        super(CustomUserAuthentication, self).__init__(protected_methods)
        self.auth = auth

    def authorize(self):
        g.user = None

        if request.method not in self.protected_methods:
            return True

        basic_auth = request.authorization
        if not basic_auth:
            return False

        g.user = self.auth.authenticate(basic_auth, basic_auth.password)
        return g.user


user_auth = CustomUserAuthentication(auth, protected_methods=['GET', 'PUT', 'POST', 'DELETE', 'PATCH'])

# instantiate our api wrapper and tell it to use HTTP basic auth using
# the same credentials as our auth system.  If you prefer this could
# instead be a key-based auth, or god forbid some open auth protocol.

api = RestAPI(app, default_auth=user_auth)
# api = RestAPI(app)

class UserResource(RestResource):
    exclude = ('password', 'email',)

# register our models so they are exposed via /api/<model>/
# api.register(User, UserResource, auth=user_auth)
# is_reg = api.is_registered(User)
# print(is_reg)

for m in models:
    if m is User:        
        api.register(User, UserResource, auth=user_auth, allowed_methods=['GET', 'PUT', 'POST', 'DELETE', 'PATCH'])
    else:
        api.register(m, auth=user_auth, allowed_methods=['GET', 'PUT', 'POST', 'DELETE', 'PATCH'])
    print(f"api registered {m}")


api.setup()

