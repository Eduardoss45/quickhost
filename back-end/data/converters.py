# converters.py
import json


def update_registered_accommodations(user, accommodation_id):
    registered_accommodations = json.loads(user.registered_accommodations)
    registered_accommodations.append(str(accommodation_id))
    user.registered_accommodations = json.dumps(registered_accommodations)
    user.save()
