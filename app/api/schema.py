""" This module contains the GRAPHQL schema that maps requests to a mongoDB database.
"""

# __version__ = '0.1'

import graphene
from bson.objectid import ObjectId
from pymongo import MongoClient, ReturnDocument
from graphql import GraphQLError
from api.jira import Jira
import os

database = os.environ.get("MONGODB")
client = MongoClient(database)
db = client.Jtray

# GraphQL Schema
###################################################

class Card(graphene.ObjectType):
    _id = graphene.String(name='id')
    text = graphene.String()
    favoritedBy = graphene.List(graphene.String)

class Tray(graphene.ObjectType):
    _id = graphene.String(name='id')
    pollId = graphene.String()
    index = graphene.String()
    title = graphene.String()
    cards = graphene.List(Card)
    createdByUserId = graphene.String()

class Poll(graphene.ObjectType):
    _id = graphene.String(name='id')
    title = graphene.String()
    createdByUserId = graphene.String()
    annotations = graphene.String()

class JiraProject(graphene.ObjectType):
    name = graphene.String()
    key = graphene.String()
    id = graphene.Int()

class JiraData(graphene.ObjectType):
    jiraDomain = graphene.String()
    jiraEmail = graphene.String()
    jiraToken = graphene.String()
    jiraProjects = graphene.List(JiraProject)

class User(graphene.ObjectType):
    _id = graphene.String(name='id')
    polls = graphene.List(Poll)
    jiraInfo = graphene.Field(JiraData)


####################################################
# Queries
###################################################

class Query(graphene.ObjectType):
    pollTrays = graphene.List(Tray, pollId= graphene.String())
    getUser = graphene.Field(User, userId = graphene.String())
    publicPolls = graphene.List(Poll)
    jiraProjects = graphene.List(JiraProject, userId = graphene.String())

    def resolve_publicPolls(self, info):
        polls = db.Polls.find({"$or" :[{"visibility":"public"},{"visibility":"password"}]}).sort("_id",-1)
        return [poll for poll in polls]

    def resolve_pollTrays(self, info, pollId):
        trays = db.Trays.find({"pollId": pollId}).sort("index",1)
        trays_list = []
        for tray in trays:
            trays_list.append(tray)
        return trays_list

    def resolve_getUser(self, info, userId):
        jiraInfo = db.Users.find_one({"userId": userId})
        polls = db.Polls.find({"createdByUserId": userId}).sort("_id",-1)

        return User(_id= userId, polls=list (polls), jiraInfo=jiraInfo)

    def resolve_jiraProjects(self, info, userId):
        user_info = db.Users.find_one({"userId":userId})
        domain = user_info['jiraDomain']
        email = user_info['jiraEmail']
        token = user_info['jiraToken']
        project_list = []
        response = Jira(domain, email, token).get_projects()
        projects = response.json()
        for i in projects:
            project_list.append({"name": i['name'] ,"key":i['key'], "id":i['id']})
        
        return project_list




####################################################
# MUTATIONS
#################################################
class AddPoll(graphene.Mutation):
    """
    Create and new empty poll returning the User with the atualized polls.
    """
    class Arguments:
        title = graphene.String()
        createdByUserId = graphene.String()
        visibility = graphene.String()
        annotations = graphene.String()
    
    _id = graphene.String(name='id')
    polls = graphene.List(Poll)

    def mutate(self, info, title, createdByUserId, visibility, annotations):

        new = db["Polls"].insert_one({"title": title, "createdByUserId": createdByUserId, "visibility": visibility, "annotations": annotations })
        polls = db.Polls.find({"createdByUserId": createdByUserId})

        return User(_id= createdByUserId, polls=list(polls))

class DeletePoll(graphene.Mutation):
    """
    Delete a poll with a given id
    """
    class Arguments:
        pollId = graphene.String()
    
    status = graphene.String()

    def mutate(self,info,  pollId):

        db["Polls"].delete_one({'_id': ObjectId(pollId)})
        db["Trays"].delete_many({'pollId': pollId})
        return "ok"

class AddTray(graphene.Mutation):
    """
    Create and return a new empty tray: Tray(id, title, cards:[])
    """
    class Arguments:
        title = graphene.String()
        userId = graphene.String()
        pollId = graphene.String()
    
    _id = graphene.String(name='id')
    index = graphene.String()
    title = graphene.String()
    pollId = graphene.String()
    cards = graphene.List(Card)

    def mutate(self, info, title, pollId, userId):
        # get the max index of the trays
        max_index = db["Trays"].find({"pollId":pollId}).sort([("index", -1)]).limit(1)

        # calculates the index of the new tray
        index = "0" if  max_index.count() == 0 else str(int(max_index[0]['index']) + 1)

        new = db["Trays"].insert_one({"index": index, "pollId": pollId, "createdByUserId": userId, 
        "title": title, "cards":[]})

        return Tray(_id= new.inserted_id, pollId= pollId, index=index, title = title, cards= [])


class DeleteTray(graphene.Mutation):
    """
    Delete a tray with a given id
    """
    class Arguments:
        trayId = graphene.String()
    
    status = graphene.String()

    def mutate(self,info,  trayId):

        status = db["Trays"].delete_one({'_id': ObjectId(trayId)})
        return status


class AddCard(graphene.Mutation):
    """
    Add and return the atualized tray: Tray(id, title, cards)
    """
    class Arguments:
        trayId = graphene.String()
        text= graphene.String()
        userId = graphene.String()
        # admin = graphene.Boolean()
    
    _id = graphene.String(name='id')
    title = graphene.String()
    cards = graphene.List(Card)


    def mutate(self, info, trayId, text, userId):
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
                        "favoritedBy":[]
                    }}}, 
            return_document=ReturnDocument.AFTER, projection=['id', 'title', 'cards'])

        return Tray(**newTray)

class DeleteCard(graphene.Mutation):
    """
    Delete a card with a given id
    """
    class Arguments:
        trayId = graphene.String()
        cardId = graphene.String()
    
    _id = graphene.String(name='id')
    title = graphene.String()
    cards = graphene.List(Card)

    def mutate(self, info, trayId, cardId):

        newTray = db["Trays"].find_one_and_update({'_id': ObjectId(trayId)}, {'$pull': {'cards':{'_id':ObjectId(cardId)}}},
        return_document=ReturnDocument.AFTER, projection=['id', 'title', 'cards'])

        return Tray(**newTray)


class SwapTray(graphene.Mutation):
    """
    swap to trays and return a new list with all trays
    """
    class Arguments:
        pollId = graphene.String()
        fromIndex = graphene.String()
        toIndex = graphene.String()

    allTrays = graphene.List(Tray)

    def mutate(self, info, pollId, fromIndex, toIndex):
        # get the sorted trays as rendered by starting the app
        trays = db.Trays.find({"pollId": pollId}).sort("index",1)
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

class SetJiraInfo(graphene.Mutation):
    """
    Set the Jira info for a given user
    """
    class Arguments:
        userId = graphene.String()
        jiraDomain = graphene.String()
        jiraEmail = graphene.String()
        jiraToken = graphene.String()
    
    status = graphene.String()

    def mutate(self, info, userId, jiraDomain, jiraEmail, jiraToken):
        response = Jira(jiraDomain,jiraEmail, jiraToken).get_projects()
        if response.status_code != 200:
            raise GraphQLError('Error accessing your projects... Verify the info!')
        project_list=[]
        projects = response.json()
        for i in projects:
            project_list.append({"name": i['name'] ,"key":i['key'], "id":i['id']})
        db.Users.update_one({"userId": userId}, {"$set" : {"jiraDomain": jiraDomain, "jiraEmail":jiraEmail, "jiraToken":jiraToken, "jiraProjects": project_list}}, upsert=True)
        status = "OK"
        return status


class Mutation(graphene.ObjectType):
    addCard = AddCard.Field()
    addTray = AddTray.Field()
    swapCard = SwapCard.Field()
    swapTray = SwapTray.Field()
    setCardFavorite = SetFavorite.Field()
    addPoll = AddPoll.Field()
    deletePoll = DeletePoll.Field()
    deleteTray = DeleteTray.Field()
    deleteCard = DeleteCard.Field()
    setJiraInfo = SetJiraInfo.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)