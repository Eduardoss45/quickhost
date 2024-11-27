class AccommodationSerializer(serializers.ModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(
        queryset=models.UserAccount.objects.all()
    )
    bank_account = serializers.PrimaryKeyRelatedField(
        queryset=models.BankDetails.objects.all(), required=False
    )
    registered_accommodations = serializers.PrimaryKeyRelatedField(
        queryset=models.UserAccount.objects.all(), many=True, required=False
    )
    registered_accommodation_bookings = serializers.PrimaryKeyRelatedField(
        queryset=models.Booking.objects.all(), many=True, required=False
    )
    registered_accommodations_reviews = serializers.PrimaryKeyRelatedField(
        queryset=models.Review.objects.all(), many=True, required=False
    )
    internal_images = serializers.ListField(
        child=serializers.ImageField(), allow_empty=True
    )
    main_cover_image = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = models.PropertyListing
        fields = "__all__"

    def create(self, validated_data):
        """Cria e salva uma nova acomodação no banco de dados."""
        logger.info("Iniciando a criação da acomodação.")
        try:
            bank_account_data = validated_data.pop("bank_account", None)
            internal_images = validated_data.pop("internal_images", [])
            main_cover_image = validated_data.pop("main_cover_image", None)
            user = validated_data.get("creator")

            consecutive_days_limit = validated_data.get("consecutive_days_limit", 0)
            if consecutive_days_limit <= 0:
                validated_data["consecutive_days_limit"] = -1

            # Ajusta o preço por noite
            price_per_night = validated_data.get("price_per_night", 0)
            price_per_night = Decimal(price_per_night)
            if price_per_night > 0:
                min_rate = Decimal("0.03")  # 3%
                max_rate = Decimal("0.16")  # 16%
                max_price_for_max_rate = Decimal("1000")
                if price_per_night <= max_price_for_max_rate:
                    rate = min_rate + (max_rate - min_rate) * (
                        price_per_night / max_price_for_max_rate
                    )
                else:
                    rate = max_rate
                price_per_night *= 1 + rate
            validated_data["price_per_night"] = round(price_per_night, 2)

            with transaction.atomic():  # Garante consistência em caso de falha
                # Cria a acomodação
                accommodation = models.PropertyListing.objects.create(**validated_data)
                accommodation_uuid = (
                    accommodation.id_accommodation
                )  # Define corretamente o UUID
                logger.info(f"Acomodação criada: {accommodation_uuid}")

                # Configura ManyToMany, se aplicável
                registered_user_bookings_data = validated_data.pop(
                    "registered_user_bookings", None
                )
                if registered_user_bookings_data:
                    accommodation.registered_user_bookings.add(
                        registered_user_bookings_data
                    )

                logger.info(
                    f"Usuários relacionados adicionados à acomodação {accommodation.id_accommodation}."
                )

                # Salvar imagens internas
                image_paths = []
                for image in internal_images:
                    if isinstance(image, TemporaryUploadedFile):
                        new_filename = f"{uuid.uuid4()}.jpg"
                        image_folder = f"property_images/{accommodation_uuid}/"
                        file_path = os.path.join(image_folder, new_filename)

                        logger.info(f"Salvando imagem {image.name} em {file_path}")
                        if default_storage.save(file_path, image):
                            image_paths.append("media/" + file_path)

                # Definir imagem de capa
                def set_main_cover_image(main_cover_image, image_paths, accommodation):
                    try:
                        main_cover_image = int(main_cover_image)
                    except (ValueError, TypeError):
                        logger.info("main_cover_image não definido ou inválido.")
                        return
                    if 0 <= main_cover_image < len(image_paths):
                        accommodation.main_cover_image = image_paths[main_cover_image]
                        logger.info(
                            f"Imagem de capa principal definida: {image_paths[main_cover_image]}"
                        )
                    else:
                        logger.info(
                            f"Índice inválido ({main_cover_image}) para main_cover_image. Deixando vazio."
                        )

                set_main_cover_image(main_cover_image, image_paths, accommodation)

                accommodation.internal_images = list(map(str, image_paths))
                accommodation.is_active = True
                accommodation.save()
                logger.info(f"URLs das imagens armazenadas: {image_paths}.")

                # Atualizar `registered_accommodations` para o usuário
                accommodation_instance.registered_accommodations.set(
                    related_accommodations
                )
                user.save()
                logger.info(
                    f"Acomodação {accommodation_uuid} adicionada ao usuário {user.id_user}."
                )

                # Criar conta bancária associada, se houver
                if bank_account_data:
                    bank_account = BankDetails.objects.create(**bank_account_data)
                    accommodation.bank_account = bank_account
                    accommodation.save()
                    logger.info(
                        f"Conta bancária associada à acomodação: {bank_account}."
                    )

                    for reg_accom in registered_accommodations_data:
                        UserAccountRegisteredAccommodations.objects.create(
                            user_account=reg_accom["user_account"],
                            property_listing=accommodation,
                        )

                    for booking in registered_bookings_data:
                        UserAccountRegisteredBookings.objects.create(
                            user_account=booking["user_account"],
                            property_listing=accommodation,
                            booking=booking["booking"],
                        )

                return accommodation
        except Exception as e:
            logger.error(f"Erro ao criar acomodação: {e}")
            raise
