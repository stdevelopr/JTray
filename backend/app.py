from flask import Flask, render_template
from flask_graphql import GraphQLView
from api.schema import schema


app = Flask(__name__)
# app.config["CACHE_TYPE"] = "null"

# Endpoint to run queries
app.add_url_rule("/graphql", view_func=GraphQLView.as_view(
    "graphql",
    schema = schema,
    graphiql=True 
))

# render all routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def main(path):
    return render_template('index.html')


if __name__ == "__main__":
    app.run(debug=True)