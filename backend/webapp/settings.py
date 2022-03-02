# import os
# import sys
# import logging
# import logging.config
# from pathlib import Path

# from dotenv import load_dotenv, find_dotenv

# load_dotenv(find_dotenv(usecwd=True))





# if os.environ.get('DB_ENGINE', 'peewee.SqliteDatabase') == 'peewee.SqliteDatabase':
#     DB_ENGINE = 'peewee.SqliteDatabase'
#     db_dir = Path(os.environ.get('DB_DIR', os.getcwd()))
#     DB_NAME = db_dir / os.environ.get('DB_NAME', 'snacking.db')
#     DB_DRIVER_ARGS = {}
# else:
#     DB_ENGINE = 'peewee.MySQLDatabase'
#     DB_NAME = os.environ.get('DB_NAME', 'shared_achievement_db')
#     db_user = os.environ.get('DB_USER')
#     db_pass = os.environ.get('DB_PASS')
#     db_host = os.environ.get('DB_HOST')
#     db_port = os.environ.get('DB_PORT')
#     DB_DRIVER_ARGS = {}
#     if db_user is not None:
#         DB_DRIVER_ARGS['user'] = db_user
#     if db_pass is not None:
#         DB_DRIVER_ARGS['password'] = db_pass
#     if db_host is not None:
#         DB_DRIVER_ARGS['host'] = db_host
#     if db_port is not None:
#         DB_DRIVER_ARGS['port'] = db_port


# # read logging config file or use default
# try:
#     logging.config.fileConfig('logging.conf')
# except (FileNotFoundError, KeyError):
#     logging.config.dictConfig({
#         'version': 1,
#         'root': {
#             'level': 'WARNING',
#             'handlers': ['console'],
#         },
#         'loggers': {
#             '__main__': {
#                 'propagate': 0,
#                 'level': 'DEBUG',
#                 'handlers': ['console'],
#             }
#         },
#         'formatters': {
#             'simple': {
#                 'format': '%(asctime)s %(name)s %(levelname)s: %(message)s',
#                 'datefmt': '%Y-%m-%d %H:%M:%S',
#             },
#         },
#         'handlers': {
#             'console': {
#                 'class': 'logging.StreamHandler',
#                 'level': 'DEBUG',
#                 'formatter': 'simple',
#                 'stream': 'ext://sys.stdout',
#             }
#         },
#     })
