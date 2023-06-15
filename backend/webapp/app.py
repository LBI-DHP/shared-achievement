import os
from environs import Env
from flask import Flask
from flask_peewee.db import Database
from config import Configuration
from flask_bootstrap import Bootstrap
# from flask_swagger_ui import get_swaggerui_blueprint

app = Flask(__name__)
Bootstrap(app)
conf = Configuration()

env = Env()
env.read_env()

conf.DATABASE['name'] = env('DB_NAME')
conf.DATABASE['user'] = env('DB_USER')
conf.DATABASE['password'] = env('DB_PASS')
conf

# app.config.from_object('settings')
# app.config.from_object('config.Configuration')
app.config.from_object(conf)

db = Database(app)

