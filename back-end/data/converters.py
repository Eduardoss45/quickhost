# converters.py
import json


def update_registered_accommodations(user, accommodation_id):
    registered_accommodations = json.loads(user.registered_accommodations)
    registered_accommodations.append(str(accommodation_id))
    user.registered_accommodations = json.dumps(registered_accommodations)
    user.save()
    
def update_registered_bookings(user, accommodation_id):
    registered_bookings = json.loads(user.registered_bookings)
    registered_bookings.append(str(accommodation_id))
    user.registered_bookings = json.dumps(registered_bookings)
    user.save()

def update_registered_reviews(user, accommodation_id):
    registered_reviews = json.loads(user.registered_reviews)
    registered_reviews.append(str(accommodation_id))
    user.registered_reviews = json.dumps(registered_reviews)
    user.save()
