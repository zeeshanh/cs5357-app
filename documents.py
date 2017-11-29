import datetime

class Movers(Document):
	moverId = 
    firstName = StringField(required=True, max_length=200)
    lastName = StringField(required=True)
    email = StringField(required=True, max_length=50)
    dateCreated = DateTimeField(default=datetime.datetime.now)