from flask import Flask, render_template
from flask_graphql import GraphQLView
from api.schema import schema


app = Flask(__name__)

# Endpoint to run queries
app.add_url_rule("/graphql", view_func=GraphQLView.as_view(
    "graphql",
    schema = schema,
    graphiql=True 
))

# render route
@app.route("/")
def main():
    return render_template('index.html')


if __name__ == "__main__":
    app.run(debug=True)