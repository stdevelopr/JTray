from flask import Flask
from pymongo import MongoClient
from flask_graphql import GraphQLView
import graphene

app = Flask(__name__)


# GraphQL Schema
######################################################################

class Card(graphene.ObjectType):
    title = graphene.String()

class Query(graphene.ObjectType):
    card = graphene.Field(Card)


    def resolve_card(self, info):
        return Card(title="teste")


schema = graphene.Schema(query=Query)

######################################################################


# Endpoint to run queries
app.add_url_rule("/graphql", view_func=GraphQLView.as_view(
    "graphql",
    schema = schema,
    graphiql=True 
))

# Test route
@app.route("/")
def main():
    query = '{card{title}}'
    result = schema.execute(query)
    title = result.data['card']['title']
    return title



if __name__ == "__main__":
    app.run(debug=True)