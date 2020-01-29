from flask import Flask, render_template
from pymongo import MongoClient
from flask_graphql import GraphQLView
import graphene
import mongoengine
from bson.objectid import ObjectId


app = Flask(__name__)

client = MongoClient("mongodb://localhost:27017")
db = client.Jtray

mongoengine.connect('Jtray')


# GraphQL Schema
######################################################################

class Card(graphene.ObjectType):
    _id = graphene.String(name='id')
    text = graphene.String()

class Tray(graphene.ObjectType):
    _id = graphene.String(name='id')
    title = graphene.String()
    cards = graphene.List(Card)

class Query(graphene.ObjectType):
    card = graphene.Field(Card)
    tray = graphene.Field(Tray, id=graphene.String())
    allTrays = graphene.List(Tray)


    def resolve_card(self, info):
        return Card(text="teste")

    def resolve_tray(self, info, id):
        return Tray(id= id, title="Teste", cards=[])

    def resolve_allTrays(self, info):
        return list(db.Trays.find({}))

####################################################
# MUTATIONS
#################################################
class AddTray(graphene.Mutation):
    class Arguments:
        title = graphene.String()
    
    ok = graphene.Boolean()
    tray = graphene.Field(Tray)

    def mutate(self, info, title):
        tray = Tray(title=title)
        ok = True
        db["Trays"].insert({"title": title, "cards":[]})
        return AddTray(tray=tray, ok=ok)

class AddCard(graphene.Mutation):
    class Arguments:
        trayId = graphene.String()
        text= graphene.String()
    
    ok = graphene.Boolean()
    card = graphene.Field(Card)

    def mutate(self, info, trayId, text):
        cardId = ObjectId()
        tray = db.Trays.find_one_and_update({'_id': ObjectId(trayId)}, {"$push":{"cards":{"_id":cardId, "text":text}}})
        card = Card(_id= cardId, text=text)
        ok = True
        return AddCard(card=card, ok=ok)

class SwapCard(graphene.Mutation):
    class Arguments:
        fromTrayId = graphene.String()
        toTrayId = graphene.String()
        fromCardIndex= graphene.Int()
        toCardIndex = graphene.Int()

    fromTrayId = graphene.String() 
    toTrayId = graphene.String()
    fromTrayCards = graphene.List(Card)
    toTrayCards = graphene.List(Card)

    def mutate(self, info, fromTrayId, toTrayId, fromCardIndex, toCardIndex):
        if(fromTrayId==toTrayId):
            fromTray = db.Trays.find_one({'_id': ObjectId(fromTrayId)})
            fromTrayCards = fromTray['cards'].copy()
            toTrayCards = fromTray['cards']
            temp = toTrayCards[fromCardIndex]
            toTrayCards[fromCardIndex] = toTrayCards[toCardIndex]
            toTrayCards[toCardIndex] = temp
            db.Trays.update({'_id': ObjectId(fromTrayId)}, {"$set":{"cards":toTrayCards}})
            return SwapCard(fromTrayId=fromTrayId, toTrayId=toTrayId, 
                            fromTrayCards=fromTrayCards, toTrayCards=toTrayCards)
        
        else:
            fromTray = db.Trays.find_one({'_id': ObjectId(fromTrayId)})
            toTray = db.Trays.find_one({'_id': ObjectId(toTrayId)})
            fromTrayCards = fromTray['cards']
            toTrayCards = toTray['cards']
            toTrayCards.insert(toCardIndex, fromTrayCards[fromCardIndex])
            del(fromTrayCards[fromCardIndex])
            db.Trays.update({'_id': ObjectId(fromTrayId)}, {"$set":{"cards":fromTrayCards}})
            db.Trays.update({'_id': ObjectId(toTrayId)}, {"$set":{"cards":toTrayCards}})
            return SwapCard(fromTrayId=fromTrayId, toTrayId=toTrayId,
                            fromTrayCards=fromTrayCards, toTrayCards=toTrayCards)
            




class Mutation(graphene.ObjectType):
    addCard = AddCard.Field()
    addTray = AddTray.Field()
    swapCard = SwapCard.Field()

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
    return render_template('index.html')

def before_request():
    app.jinja_env.cache = {}

app.before_request(before_request)


if __name__ == "__main__":
    app.run(debug=True)