import os
from flask import Flask, render_template, request, jsonify
from flask_graphql import GraphQLView
from functools import wraps
import jwt
from api.schema import schema, db
from api.jira import Jira
from passlib.hash import sha256_crypt
import json

app = Flask(__name__)
JWT_SECRET = os.environ.get("JWT_SECRET")
# //

# decorator to protect routes
def token_required(f):
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        except:
            return jsonify({'message':'Token is invalid!'}), 401

        return f(*args, **kwargs)
    
    return decorated


# graphql view function
graphql_view = GraphQLView.as_view(
    "graphql",
    schema = schema,
    graphiql=True 
)

# Endpoint to run queries
app.add_url_rule("/graphql", view_func=token_required(graphql_view), methods=['GET','POST'])


# JIRA API
######################################################################
@app.route('/api/jira/get')
def jira_get():
    # it = Jira().create_issue(body)
    response = Jira().get_projects()
    projects = response.json()
    for i in projects:
        print('Todo-  Save info: ', i['name'], i['key'], i['id'])

    return jsonify(response.json())

@app.route('/api/jira/post')
def jira_post():
    body = {
        "fields": {
            "project": {
                "id": "10000"
            },
            "summary": "New formula",
            "description": "Testing...",
            "issuetype": {
                "name": "Story"
            }
        }
    }
    response = Jira().create_issue(body)
    return response.json()





# LOGIN SERVICE
####################################################################
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']
    if username and password:
        user = db.Login.find_one({"username": username})
        if user:
            if sha256_crypt.verify(password, user['password']):
                payload = {
                    "id": username,
                }
                token = jwt.encode(payload, JWT_SECRET, algorithm='HS256').decode('utf-8')
                return jsonify({"token":token}), 200
            else:
                return "Wrong password!", 403  
        else:
            return "User not found!", 404
       
    else:
        return "Missing information", 500


@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        username = data['username']
        password = data['password']
        if db.Login.find({"username": username}).count():
            return "Username already in use", 409
        db.Login.insert_one({"username": username, "password": sha256_crypt.encrypt(password)})
        return 'Registered successfully', 200
    except:
        return "Something went wrong", 500

##########################################################################################3

@app.route('/', defaults={'path': ''})
def main(path):
    return render_template('index.html')


if __name__ == "__main__":
    app.run(debug=True)