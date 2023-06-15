
class Configuration(object):
    DATABASE = {
        'name': 'shared_achievement_db',
        'host':'localhost',
	    'user':'lbi',
	    'password':'lbi',
        'engine': 'peewee.MySQLDatabase',
    }

    DEBUG = True
    SECRET_KEY = 'kjkWLIO6vv'
    MIN_STEPS_TO_PUSH_NOTIFICATION = 1000
    APPLICATION_ROOT = '/sa'