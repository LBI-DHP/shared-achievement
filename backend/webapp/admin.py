"""
admin imports app, auth and models, but none of these import admin
so we're OK
"""
from flask_peewee.admin import Admin, ModelAdmin

from app import app, db
from auth import auth
from models import models

admin = Admin(app, auth)
auth.register_admin(admin)
for m in models:
    admin.register(m, ModelAdmin)
# or you could admin.register(User, ModelAdmin) -- you would also register
# any other models here.