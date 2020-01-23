from flask import Flask, render_template
from pymongo import MongoClient
from flask_graphql import GraphQLView
import graphene

app = Flask(__name__)


client = MongoClient("mongodb://localhost:27017")
db = client.Jtray


# GraphQL Schema
######################################################################

class Card(graphene.ObjectType):
    text = graphene.String()

class Query(graphene.ObjectType):
    card = graphene.Field(Card)


    def resolve_card(self, info):
        return Card(text="teste")

class CreateCard(graphene.Mutation):
    class Arguments:
        text= graphene.String()
    
    ok = graphene.Boolean()
    card = graphene.Field(Card)

    def mutate(self, info, text):
        card = Card(text=text)
        ok = True
        db["cards"].insert({"text":text})
        return CreateCard(card=card, ok=ok)


class Mutation(graphene.ObjectType):
    create_card = CreateCard.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)

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
    print(title)
    return render_template('index.html')

def before_request():
    app.jinja_env.cache = {}

app.before_request(before_request)


if __name__ == "__main__":
    app.run(debug=True)