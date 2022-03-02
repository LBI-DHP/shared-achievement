import os

from flask import Flask
from flask_peewee.db import Database
# from flask_swagger_ui import get_swaggerui_blueprint

app = Flask(__name__)

# app.config.from_object('settings')
app.config.from_object('config.Configuration')

db = Database(app)

