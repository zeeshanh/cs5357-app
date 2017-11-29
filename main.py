import json

from bson import json_util
from flask import Flask, request, Response, session, jsonify
from flask_pymongo import PyMongo
from pymongo.errors import DuplicateKeyError
from werkzeug import security
from werkzeug.exceptions import BadRequest, NotFound, UnsupportedMediaType, Unauthorized
from authy.api import AuthyApiClient
from exceptions import JSONExceptionHandler
from pymongo import MongoClient
import datetime
#from mongoengine import *

# This defines a Flask application
app = Flask(__name__)

# This code here converts Flask's default (HTML) errors to Json errors.
# This is helpful because HTML breaks clients that are expecting JSON
#JSONExceptionHandler(app)

# We configure the app object
#app.config['MONGO_DBNAME'] = 'moving_database'
app.secret_key = 'A0Zr98j/3yX R~XHH!!!jmN]LWX/,?RT2341'

# This initializes PyMongo and makes `mongo` available
#mongo = PyMongo(app)
authy_api = AuthyApiClient('nhC1DZj2WEeGhKqqi1NNvcIrEHAL30W9')

# database schema
client = MongoClient()
client = MongoClient('localhost', 27017)
db = client['moving_database']
#mongoengine.connect('moving_database', host='localhost', port=27017)
movers = db['movers']
moverReviews = db['mover_reviews']
jobs = db['jobs']
offers = db['offers']
jobPhotos = db['job_photos']


#creating movers data
@app.route('/addMovers', methods = ['POST'])
def addMovers():
    try:
        post = {"firstName": "Mike",
                "lastName": "Weener",
                "email": "mikew@gmail.com",
                "password": "1234",
                "zipcode":10103,
                "vehicle": "bmw",
                "phone": "123456789",
                "paymentTypes": "debit",
                "profilePhoto": "mike.jpg",
                "date": datetime.datetime.utcnow()}

        #jsonData = request.json['info'] - comes from frontend
        #firstName = json_data['firstName']

        postId = movers.insert_one(post).inserted_id

        return jsonify(status='OK',message='inserted successfully')
        #return postId

    except Exception,e:
        return jsonify(status='ERROR',message=str(e))

#fetching the entire movers list
@app.route('/fetchMoversList', methods = ['POST'])
def fetchMoversList():
    try:
        moversUsers = db.movers.find()
        
        moversList = []
        for user in moversUsers:
            #print user
            u = {
                    "firstName":user['firstName'],
                    "lastName":user['lastName'],
                    "email":user['email'],
                    "password":user['password'],
                    "zipcode":str(user['zipcode']),
                    "vehicle":user['vehicle'],
                    "phone":user['phone'],
                    "paymentTypes":user['paymentTypes'],
                    "profilePhoto":user['profilePhoto'],
                    "date":str(user['date']),
                    'id': str(user['_id'])
                    }
            moversList.append(u)

    except Exception,e:
        return str(e)

    return json.dumps(moversList)

#updating attributes i.e. phone number
@app.route('/updatePhone', methods = ['POST'])
def updatePhone():
    try:
        phoneInfo = request.json['info']
        phone = phoneInfo['phone']
        moverId = phoneInfo['id']

        db.movers.update_one({'_id':ObjectId(moverId)},{'$set':{'phone':phone}})
        return jsonify(status='OK',message='updated successfully')
    except Exception, e:
        return jsonify(status='ERROR',message=str(e))

#creating movers Review data
@app.route('/addMoverReviews', methods = ['POST'])
def addMoverReviews():
    try:
        '''post = {"firstName": "Mike",
                "lastName": "Weener",
                "email": "mikew@gmail.com",
                "password": "1234",
                "zipcode":10103,
                "vehicle": "bmw",
                "phone": "123456789",
                "paymentTypes": "debit",
                "profilePhoto": "mike.jpg",
                "date": datetime.datetime.utcnow()}'''

        #jsonData = request.json['info'] - comes from frontend
        #firstName = json_data['firstName']

        postId = moverReviews.insert_one(post).inserted_id

        return jsonify(status='OK',message='inserted successfully')
        #return postId

    except Exception,e:
        return jsonify(status='ERROR',message=str(e))

#creating movers Review data
@app.route('/addJobs', methods = ['POST'])
def addJobs():
    try:
        '''post = {"firstName": "Mike",
                "lastName": "Weener",
                "email": "mikew@gmail.com",
                "password": "1234",
                "zipcode":10103,
                "vehicle": "bmw",
                "phone": "123456789",
                "paymentTypes": "debit",
                "profilePhoto": "mike.jpg",
                "date": datetime.datetime.utcnow()}'''

        #jsonData = request.json['info'] - comes from frontend
        #firstName = json_data['firstName']

        postId = jobs.insert_one(post).inserted_id

        return jsonify(status='OK',message='inserted successfully')
        #return postId

    except Exception,e:
        return jsonify(status='ERROR',message=str(e))

#creating movers Review data
@app.route('/addJobPhotos', methods = ['POST'])
def addJobPhotos():
    try:
        '''post = {"firstName": "Mike",
                "lastName": "Weener",
                "email": "mikew@gmail.com",
                "password": "1234",
                "zipcode":10103,
                "vehicle": "bmw",
                "phone": "123456789",
                "paymentTypes": "debit",
                "profilePhoto": "mike.jpg",
                "date": datetime.datetime.utcnow()}'''

        #jsonData = request.json['info'] - comes from frontend
        #firstName = json_data['firstName']

        postId = jobPhotos.insert_one(post).inserted_id

        return jsonify(status='OK',message='inserted successfully')
        #return postId

    except Exception,e:
        return jsonify(status='ERROR',message=str(e))

#creating movers Review data
@app.route('/addOffers', methods = ['POST'])
def addOffers():
    try:
        '''post = {"firstName": "Mike",
                "lastName": "Weener",
                "email": "mikew@gmail.com",
                "password": "1234",
                "zipcode":10103,
                "vehicle": "bmw",
                "phone": "123456789",
                "paymentTypes": "debit",
                "profilePhoto": "mike.jpg",
                "date": datetime.datetime.utcnow()}'''

        #jsonData = request.json['info'] - comes from frontend
        #firstName = json_data['firstName']

        postId = offers.insert_one(post).inserted_id

        return jsonify(status='OK',message='inserted successfully')
        #return postId

    except Exception,e:
        return jsonify(status='ERROR',message=str(e))


@app.route('/addPhone', methods = ['POST'])
def addPhone():
    # if session.get('user') is None:
    #     raise Unauthorized()

    body = request.get_json()
    if body.get('number') is None:
        raise BadRequest('missing phone number')

    number = body.get('number')
    resp =authy_api.phones.verification_start(number, 1, via='sms')
    

    if resp.content["success"]:
        #Add number to database record
        return Response(200)
    else:
        return Response("Invalid number",400)

@app.route('/verify', methods = ['POST'])
def verifyCode():
    #if session.get('user') is None:
    #     raise Unauthorized()

    body = request.get_json()
    if body.get('code') is None:
        raise BadRequest('missing verification code')

    code = body.get('code')

    #Get number from database instead
    #user = mongo.db.users.find_one({'username': "zee"})
    #number = user["number"]
    number = "9174766772"

    resp = authy_api.phones.verification_check(number, 1, code)

    if resp.content["success"]:
        return Response(200)

    else:
        #Either code is wrong or has expired
        return Response(401)



@app.route('/logout')
def logout():
    """
    This 'logs out' the user by clearing the session data
    """
    session.clear()
    return Response(status=200)


@app.route('/user', methods=['GET'])
def who_am_i():
    """
    Simple method just to show how you can access session data
    :return:
    """
    if session.get('user') is None:
        raise Unauthorized()
    return jsonify(session.get('user'))


@app.route('/user', methods=['PUT'])
def login():
    """
    This method logs the user in by checking username + password
    against the mongo database
    :return:
    """
    # Bounce any requests that are not JSON type requests
    if not request.is_json:
        raise UnsupportedMediaType()

    # Check that the request body has `username` and `password` properties
    body = request.get_json()
    if body.get('username') is None:
        raise BadRequest('missing username property')
    if body.get('password') is None:
        raise BadRequest('missing password property')

    user = mongo.db.users.find_one({'username': body.get('username')})
    if user is None:
        session.clear()
        raise BadRequest('User not found')
    if not security.check_password_hash(user['password_hash'], body.get('password')):
        session.clear()
        raise BadRequest('Password does not match')

    # this little trick is necessary because MongoDb sends back objects that are
    # CLOSE to json, but not actually JSON (principally the ObjectId is not JSON serializable)
    # so we just convert to json and use `loads` to get a dict
    serializable_user_obj = json.loads(json_util.dumps(user))
    session['user'] = serializable_user_obj
    return Response(status=200)


@app.route('/user', methods=['POST'])
def add_new_user():
    """
    This method is used to register a new user.
    :return:
    """
    # Bounce any requests that are not JSON type requests
    if not request.is_json:
        raise UnsupportedMediaType()

    # Check that the request body has `username` and `password` properties
    body = request.get_json()
    if body.get('username') is None:
        raise BadRequest('missing username property')
    if body.get('password') is None:
        raise BadRequest('missing password property')

    password_hash = security.generate_password_hash(body.get('password'))
    try:
        mongo.db.users.insert_one({'username': body.get('username'), 'password_hash': password_hash})
    except DuplicateKeyError:
        raise NotFound('User already exists')

    # check that mongo didn't fail
    return Response(status=201)


@app.route('/jobs', methods=['POST'])
def create_job():
    """
    Create a record in the jobs collection.
    Only possible if the user is logged in!!
    """
    # Bounce any requests that are not JSON type requests
    if not request.is_json:
        raise UnsupportedMediaType()

    if session.get('user') is None:
        raise Unauthorized()

    # Check that the JSON request has the fields you expect
    body = request.get_json()
    if body.get('start_time') is None:
        raise BadRequest('missing start_time property')
    if body.get('end_time') is None:
        raise BadRequest('missing end_time property')
    # ... obviously you'll want to have many more fields

    # Create a dictionary that will be inserted into Mongo
    job_record = {'start_time': body.get('start_time'), 'end_time': body.get('end_time')}
    job_record.update({'user': session['user']['_id']['$oid']})

    # Insert into the mongo collection
    res = mongo.db.jobs.insert_one(job_record)
    return Response(str(res.inserted_id), 200)


# This allows you to run locally.
# When run in GCP, Gunicorn is used instead (see entrypoint in app.yaml) to
# Access the Flack app via WSGI
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)