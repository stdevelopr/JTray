import graphene
from pymongo import MongoClient, ReturnDocument
from bson.objectid import ObjectId

client = MongoClient("mongodb://localhost:27017")
db = client.Jtray

# GraphQL Schema
###################################################

class Card(graphene.ObjectType):
    _id = graphene.String(name='id')
    text = graphene.String()

class Tray(graphene.ObjectType):
    _id = graphene.String(name='id')
    title = graphene.String()
    cards = graphene.List(Card)


####################################################
# Queries
###################################################

class Query(graphene.ObjectType):
    allTrays = graphene.List(Tray)

    def resolve_allTrays(self, info):
        return list(db.Trays.find({}))


####################################################
# MUTATIONS
#################################################
class AddTray(graphene.Mutation):
    class Arguments:
        title = graphene.String()
    
    _id = graphene.String(name='id')
    title = graphene.String()
    cards = graphene.List(Card)
    # ok = graphene.Boolean()

    def mutate(self, info, title):
        # tray = Tray(title=title)
        new = db["Trays"].insert_one({"title": title, "cards":[]})

        return Tray(_id= new.inserted_id, title = title, cards= [])

class AddCard(graphene.Mutation):
    """
    Returns the atualized tray: Tray(id, title, cards)
    """
    class Arguments:
        trayId = graphene.String()
        text= graphene.String()
    
    _id = graphene.String(name='id')
    title = graphene.String()
    cards = graphene.List(Card)

    def mutate(self, info, trayId, text):
        # generates an id for the new card
        cardId = ObjectId()
        # get the atualized tray after inserting the card
        newTray = db.Trays.find_one_and_update({'_id': ObjectId(trayId)}, {"$push":{"cards":{"_id":cardId, "text":text}}}, 
        return_document=ReturnDocument.AFTER)

        return Tray(**newTray)

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