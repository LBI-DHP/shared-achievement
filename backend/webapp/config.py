
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