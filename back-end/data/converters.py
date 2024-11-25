# converters.py
import json


def update_registered_accommodations(user, accommodation):
    registered_accommodations = json.loads(user.registered_accommodations)
    registered_accommodations.append(str(accommodation))
    user.registered_accommodations = json.dumps(registered_accommodations)
    user.save()


def update_registered_accommodations_bookings(user, accommodation):
    registered_accommodations_bookings = json.loads(
        user.registered_accommodations_bookings
    )
    registered_accommodations_bookings.append(str(accommodation))
    user.registered_accommodations_bookings = json.dumps(
        registered_accommodations_bookings
    )
    user.save()


def update_registered_bookings(user, accommodation):
    registered_bookings = json.loads(user.registered_bookings)
    registered_bookings.append(str(accommodation))
    user.registered_bookings = json.dumps(registered_bookings)
    user.save()
    registered_bookings = json.loads(accommodation.registered_bookings)
    registered_bookings.append(str(user))
    accommodation.registered_bookings = json.dumps(registered_bookings)
    accommodation.save()


def update_registered_user_bookings(user, accommodation):
    registered_user_bookings = json.loads(accommodation.registered_user_bookings)
    registered_user_bookings.append(str(user))
    accommodation.registered_user_bookings = json.dumps(registered_user_bookings)
    accommodation.save()


def update_registered_reviews(user, accommodation):
    registered_reviews = json.loads(user.registered_reviews)
    registered_reviews.append(str(accommodation))
    user.registered_reviews = json.dumps(registered_reviews)
    user.save()


def update_registered_favorite_property(user, accommodation):
    registered_reviews = json.loads(user.registered_reviews)
    registered_reviews.append(str(accommodation))
    user.registered_reviews = json.dumps(registered_reviews)
    user.save()
