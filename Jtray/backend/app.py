from flask import Flask, render_template, request, jsonify
from flask_graphql import GraphQLView
from api.schema import schema
from functools import wraps
import jwt


app = Flask(__name__)
app.config["SECRET_KEY"] = "secretkey"
app.config["LOGIN_REQUIRED"] = False


# decorator to protect routes
def token_required(f):
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            # current_user = data['user']['id']
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

# conditional auth
view_func = token_required(graphql_view) if app.config["LOGIN_REQUIRED"] else graphql_view

# Endpoint to run queries
app.add_url_rule("/graphql", view_func=view_func, methods=['GET','POST'])

# render all routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def main(path):
    return render_template('index.html')


if __name__ == "__main__":
    app.run(debug=True)