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