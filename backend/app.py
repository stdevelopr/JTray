import os
from flask import Flask, render_template, request, jsonify
from flask_graphql import GraphQLView
from functools import wraps
import jwt
from api.schema import schema, db
from passlib.hash import sha256_crypt

app = Flask(__name__)
JWT_SECRET = os.environ.get("JWT_SECRET")


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
                return "wrong password!", 403  
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
            return "username already in use", 409
        db.Login.insert_one({"username": username, "password": sha256_crypt.encrypt(password)})
        return 'success', 200
    except:
        return "error", 500

##########################################################################################3

@app.route('/', defaults={'path': ''})
def main(path):
    return render_template('index.html')


if __name__ == "__main__":
    app.run(debug=True)