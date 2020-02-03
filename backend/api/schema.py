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
    """
    Returns a new empty tray: Tray(id, title, cards:[])
    """
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


    trays = graphene.List(Tray)

    def mutate(self, info, fromTrayId, toTrayId, fromCardIndex, toCardIndex):
        if(fromTrayId==toTrayId):
            # get the cards of the tray
            fromTray = db.Trays.find_one({'_id': ObjectId(fromTrayId)})
            fromTrayCards = fromTray['cards'].copy()
            # remove the card from the original position
            fromCard = fromTrayCards.pop(fromCardIndex)
            # add the card to the destination index
            fromTrayCards.insert(toCardIndex, fromCard)
            # update de database
            db.Trays.update({'_id': ObjectId(fromTrayId)}, {"$set":{"cards":fromTrayCards}})
            return SwapCard(trays= [Tray(_id=fromTrayId, cards=fromTrayCards)])
        
        else:
            # get the cards of the trays
            fromTray = db.Trays.find_one({'_id': ObjectId(fromTrayId)})
            toTray = db.Trays.find_one({'_id': ObjectId(toTrayId)})
            fromTrayCards = fromTray['cards'].copy()
            toTrayCards = toTray['cards'].copy()

            # remove the card from the original position
            fromCard = fromTrayCards.pop(fromCardIndex)

            # add the card to the destination index
            toTrayCards.insert(toCardIndex, fromCard)

            # update the database
            db.Trays.update({'_id': ObjectId(fromTrayId)}, {"$set":{"cards":fromTrayCards}})
            db.Trays.update({'_id': ObjectId(toTrayId)}, {"$set":{"cards":toTrayCards}})
            return SwapCard(trays= [Tray(_id=fromTrayId, cards=fromTrayCards), 
                                    Tray(_id=toTrayId, cards=toTrayCards)])
            




class Mutation(graphene.ObjectType):
    addCard = AddCard.Field()
    addTray = AddTray.Field()
    swapCard = SwapCard.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)