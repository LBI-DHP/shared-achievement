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
