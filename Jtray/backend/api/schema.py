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
    adminUser = graphene.Boolean()
    favoritedBy = graphene.List(graphene.String)

class Tray(graphene.ObjectType):
    _id = graphene.String(name='id')
    index = graphene.String()
    title = graphene.String()
    cards = graphene.List(Card)
    createdByUserId = graphene.String()
    adminUser = graphene.Boolean()


####################################################
# Queries
###################################################

class Query(graphene.ObjectType):
    allTrays = graphene.List(Tray)

    def resolve_allTrays(self, info):
        trays = db.Trays.find({}).sort("index",1)
        trays_list = []
        for tray in trays:
            trays_list.append(tray)
        return trays_list


####################################################
# MUTATIONS
#################################################
class AddTray(graphene.Mutation):
    """
    Returns a new empty tray: Tray(id, title, cards:[])
    """
    class Arguments:
        title = graphene.String()
        userId = graphene.Int()
        admin = graphene.Boolean()
    
    _id = graphene.String(name='id')
    index = graphene.String()
    title = graphene.String()
    cards = graphene.List(Card)

    def mutate(self, info, title, userId, admin):
        # get the max index of the trays
        max_index = db["Trays"].find({}).sort([("index", -1)]).limit(1)
        # if there is no documents set the index to 0
        if max_index.count() == 0:
            index = "0"
            # else get the max value and increment one
        else:
            index = str(int(max_index[0]['index']) + 1)
        # write to db
        new = db["Trays"].insert_one({"index": index, "createdByUserId": userId, "adminUser": admin, "title": title, "cards":[]})

        return Tray(_id= new.inserted_id, index=index, title = title, cards= [])

class AddCard(graphene.Mutation):
    """
    Returns the atualized tray: Tray(id, title, cards)
    """
    class Arguments:
        trayId = graphene.String()
        text= graphene.String()
        userId = graphene.Int()
        admin = graphene.Boolean()
    
    _id = graphene.String(name='id')
    title = graphene.String()
    cards = graphene.List(Card)


    def mutate(self, info, trayId, text, userId, admin):
        # generates an id for the new card
        cardId = ObjectId()
        # get the atualized tray after inserting the card
        newTray = db.Trays.find_one_and_update(
            {'_id': ObjectId(trayId)}, 
                {"$push":
                    {"cards":
                        {"_id":cardId, 
                        "text":text, 
                        "createdByUserId": userId, 
                        "adminUser": admin,
                        "favoritedBy":[]
                    }}}, 
            return_document=ReturnDocument.AFTER, projection=['id', 'title', 'cards'])

        return Tray(**newTray)


class SwapTray(graphene.Mutation):
    """
    swap to trays and return a new list with all trays
    """
    class Arguments:
        # trayId = graphene.String()
        fromIndex = graphene.String()
        toIndex = graphene.String()

    allTrays = graphene.List(Tray)

    def mutate(self, info, fromIndex, toIndex):

        # get the sorted trays as rendered by starting the app
        trays = db.Trays.find({}).sort("index",1)
        # loop the trays and contruct a dict with the trays and a list with the indexes
        index_list = []
        tray_list = []
        for tray in trays:
            tray_list.append(tray)
            index_list.append(tray['index'])

        # rearange the index of the list
        dragged_index = index_list.pop(int(fromIndex))
        index_list.insert(int(toIndex), dragged_index)

        # modify the trays index according to the index list
        for index, tray_index in enumerate(index_list):
            tray_list[int(tray_index)]['index'] = index

        # update db
        for tray in tray_list:
            db.Trays.find_one_and_update({'_id': ObjectId(tray["_id"])}, {"$set":{"index":tray["index"]}})

        return SwapTray(allTrays=tray_list)
    


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
            


class SetFavorite(graphene.Mutation):
    """
    Set a card as favorite. Return a list with the atualized tray cards
    """
    class Arguments:
        trayId = graphene.String()
        cardId = graphene.String()
        userId = graphene.String()
        favoriteStatus = graphene.Boolean()
    
    cards = graphene.List(Card)

    def mutate(self, info, trayId, cardId, userId, favoriteStatus):
        query = {'_id':ObjectId(trayId) ,'cards._id': ObjectId(cardId)}

        # add or remove the user from the favoritedBy array
        if favoriteStatus:
            update= {'$push': {'cards.$.favoritedBy':userId}}
        else:
            update= {'$pull': {'cards.$.favoritedBy':userId}}
        newCards = db.Trays.find_one_and_update(query, update, 
            return_document=ReturnDocument.AFTER, projection=['cards'])

        return newCards

class Mutation(graphene.ObjectType):
    addCard = AddCard.Field()
    addTray = AddTray.Field()
    swapCard = SwapCard.Field()
    swapTray = SwapTray.Field()
    setCardFavorite = SetFavorite.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)