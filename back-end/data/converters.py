def update_registered_accommodations(user, accommodation):
    # Garantir que o campo seja tratado como lista
    registered_accommodations = user.registered_accommodations or []
    registered_accommodations.append(str(accommodation))
    user.registered_accommodations = registered_accommodations
    user.save()


def update_registered_accommodations_bookings(user, accommodation):
    # Garantir que o campo seja tratado como lista
    registered_accommodations_bookings = user.registered_accommodations_bookings or []
    registered_accommodations_bookings.append(str(accommodation))
    user.registered_accommodations_bookings = registered_accommodations_bookings
    user.save()


def update_registered_bookings(user, accommodation):

    # Atualizando o campo 'registered_bookings' do usuário
    # print("bookings usuario init:", user.registered_bookings)
    user_bookings = user.registered_bookings or []
    user_bookings.append(str(accommodation.id_accommodation))
    user.registered_bookings = user_bookings
    user.save()
    # print("bookings usuario end:", user.registered_bookings)

    # Atualizando o campo 'registered_bookings' da acomodação
    # print("bookings acomodacao init:", accommodation.registered_bookings)
    accommodation_bookings = accommodation.registered_bookings or []
    accommodation_bookings.append(str(user.id_user))
    accommodation.registered_bookings = accommodation_bookings
    accommodation.save()
    # print("bookings acomodacao end:", accommodation.registered_bookings)


def update_registered_user_bookings(user, accommodation):
    # Garantir que o campo seja tratado como lista
    registered_user_bookings = accommodation.registered_user_bookings or []
    registered_user_bookings.append(str(user))
    accommodation.registered_user_bookings = registered_user_bookings
    accommodation.save()


def update_registered_reviews(user, accommodation):
    # Garantir que o campo seja tratado como lista
    registered_reviews = user.registered_reviews or []
    registered_reviews.append(str(accommodation))
    user.registered_reviews = registered_reviews
    user.save()


def update_registered_favorite_property(user, accommodation):
    # Garantir que o campo seja tratado como lista
    registered_favorite_property = user.registered_favorite_property or []
    registered_favorite_property.append(str(accommodation))
    user.registered_favorite_property = registered_favorite_property
    user.save()
