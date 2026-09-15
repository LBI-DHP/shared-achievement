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

import json
import httplib2

sock = httplib2.Http()
sock.add_credentials('admin', 'admin') # use basic auth

post_obj = {
    'name': 'foo'
}
post_json = json.dumps(post_obj)

headers, resp = sock.request('http://127.0.0.1:5000/api/team/', 'POST', body=post_json)
print(headers)
# response = json.loads(resp)
# print(response)

update_obj = {
    'name': 'bar'
}
update_json = json.dumps(update_obj)

headers, resp = sock.request('http://127.0.0.1:5000/api/team/2/', 'PUT', body=update_json)
print(headers['status'])

headers, resp = sock.request('http://127.0.0.1:5000/api/team/2/', 'DELETE', body=update_json, headers={'content-type': 'application/json'})
print(headers['status'])


steps_obj = {
    'user_id': 6,
    'steps': 100
}
steps_json = json.dumps(steps_obj)
headers, resp = sock.request('http://127.0.0.1:5000/push_steps', 'POST', body=steps_json, headers={'content-type': 'application/json'})
print(headers['status'])
print(resp)