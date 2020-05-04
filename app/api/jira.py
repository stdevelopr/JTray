# This code sample uses the 'requests' library:
# http://docs.python-requests.org
import requests
from requests.auth import HTTPBasicAuth
import json
from .config import jira_email, jira_user_url, jira_token



class Jira():
    def __init__(self):
        self.user_url = jira_user_url
        self.auth = HTTPBasicAuth(jira_email, jira_token)
        self.headers = {
        "Content-Type": "application/json"
        }

    def create_issue(self, body):
        api = "rest/api/2/issue"
        response = requests.post(
            self.user_url + api,
            headers= self.headers,
            data= json.dumps(body),
            auth=self.auth
            )
        return response

    def get_projects(self):
        api = "/rest/api/2/project"
        response = requests.get(
        self.user_url + api,
        headers= self.headers,
        auth=self.auth
        )

        return response





# print(json.dumps(json.loads(response.text), sort_keys=True, indent=4, separators=(",", ": ")))



# get all projects
# /rest/api/2/project

# issues types for a project
# /rest/api/2/issue/createmeta/{projectIdOrKey}/issuetypes

# issues metainfo
# /rest/api/2/issue/createmeta



# "issuetypes":[{"self":"https://stdevelopr.atlassian.net/rest/api/2/issuetype/10002","id":"10002","description":"A small, distinct piece of work.","iconUrl":"https://stdevelopr.atlassian.net/secure/viewavatar?size=medium&avatarId=10318&avatarType=issuetype","name":"Task","subtask":false},{"self":"https://stdevelopr.atlassian.net/rest/api/2/issuetype/10003","id":"10003","description":"A small piece of work that's part of a larger task.","iconUrl":"https://stdevelopr.atlassian.net/secure/viewavatar?size=medium&avatarId=10316&avatarType=issuetype","name":"Sub-task","subtask":true},{"self":"https://stdevelopr.atlassian.net/rest/api/2/issuetype/10001","id":"10001","description":"Functionality or a feature expressed as a user goal.","iconUrl":"https://stdevelopr.atlassian.net/secure/viewavatar?size=medium&avatarId=10315&avatarType=issuetype","name":"Story","subtask":false},{"self":"https://stdevelopr.atlassian.net/rest/api/2/issuetype/10004","id":"10004","description":"A problem or error.","iconUrl":"https://stdevelopr.atlassian.net/secure/viewavatar?size=medium&avatarId=10303&avatarType=issuetype","name":"Bug","subtask":false},{"self":"https://stdevelopr.atlassian.net/rest/api/2/issuetype/10000","id":"10000","description":"A big user story that needs to be broken down. Created by Jira Software - do not edit or delete.","iconUrl":"https://stdevelopr.atlassian.net/images/icons/issuetypes/epic.svg","name":"Epic","subtask":false}]}]}