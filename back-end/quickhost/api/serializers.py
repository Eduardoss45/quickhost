from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.files.uploadedfile import TemporaryUploadedFile
from django.core.files.storage import default_storage
from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.urls import reverse
from urllib.parse import urlparse
from data import models
import os
import uuid
import logging


from .validation import (
    validate_birth_date,
    validate_phone_number,
    validate_username,
    validate_email,
    validate_social_name,
    validate_profile_picture,
    validate_emergency_contact,
    validate_password,
    validate_room_count,
    validate_bed_count,
    validate_bathroom_count,
    validate_guest_capacity,
    validate_price_per_night,
    validate_main_cover_image,
    validate_space_type,
    validate_address,
    validate_city,
    validate_category,
    validate_neighborhood,
    validate_postal_code,
    validate_wifi,
    validate_tv,
    validate_kitchen,
    validate_washing_machine,
    validate_parking_included,
    validate_air_conditioning,
    validate_pool,
    validate_jacuzzi,
    validate_grill,
    validate_private_gym,
    validate_beach_access,
    validate_smoke_detector,
    validate_fire_extinguisher,
    validate_first_aid_kit,
    validate_outdoor_camera,
)


User = get_user_model()
logger = logging.getLogger("my_logger")


def generate_new_filename(original_filename):
    """Gera um novo nome de arquivo para a imagem de perfil."""
    import uuid
    import os

    extension = os.path.splitext(original_filename)[1]
    new_filename = f"{uuid.uuid4().hex}{extension}"
    return new_filename


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer para criação de novos usuários."""

    class Meta:
        model = models.UserAccount
        fields = [
            "birth_date",
            "phone_number",
            "username",
            "email",
            "social_name",
            "profile_picture",
            "emergency_contact",
            "password",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, attrs):
        """Valida os campos do usuário."""
        errors = {}

        birth_date_error = validate_birth_date(attrs.get("birth_date"))
        if birth_date_error:
            errors["birth_date"] = birth_date_error

        phone_number_error = validate_phone_number(attrs.get("phone_number"))
        if phone_number_error:
            errors["phone_number"] = phone_number_error

        username_error = validate_username(attrs.get("username"))
        if username_error:
            errors["username"] = username_error

        email_error = validate_email(attrs.get("email"))
        if email_error:
            errors["email"] = email_error

        social_name_error = validate_social_name(attrs.get("social_name"))
        if social_name_error:
            errors["social_name"] = social_name_error

        profile_picture = attrs.get("profile_picture")
        profile_picture_error = validate_profile_picture(profile_picture)
        if profile_picture_error:
            errors["profile_picture"] = profile_picture_error

        emergency_contact_error = validate_emergency_contact(
            attrs.get("emergency_contact")
        )
        if emergency_contact_error:
            errors["emergency_contact"] = emergency_contact_error

        password_error = validate_password(attrs.get("password"))
        if password_error:
            errors["password"] = password_error

        if errors:
            logger.error(f"Erros de validação encontrados: {errors}")
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        """Cria e salva um novo usuário no banco de dados."""
        logger.debug("Iniciando a criação do usuário.")

        password = validated_data.pop("password", None)
        profile_picture = validated_data.pop("profile_picture", None)

        user = User.objects.create_user(**validated_data)
        user.is_active = True
        logger.info(
            f"Usuário '{user.username}' criado com sucesso. UUID: {user.id_user}"
        )

        if profile_picture:
            new_filename = generate_new_filename(profile_picture.name)
            user.profile_picture.save(
                os.path.join(str(user.id_user), new_filename),
                profile_picture,
                save=True,
            )

        if password:
            user.set_password(password)
            user.save()

        logger.debug(f"Usuário criado: {user}")
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer para atualização de dados do usuário."""

    class Meta:
        model = models.UserAccount
        fields = [
            "phone_number",
            "username",
            "social_name",
            "profile_picture",
            "emergency_contact",
            "password",
        ]
        extra_kwargs = {field: {"required": False} for field in fields}

    def validate(self, attrs):
        """Valida os campos do usuário para atualização."""
        errors = {}

        if "username" in attrs:
            username_error = validate_username(attrs.get("username"))
            if username_error:
                errors["username"] = username_error

        if "phone_number" in attrs:
            phone_number_error = validate_phone_number(attrs.get("phone_number"))
            if phone_number_error:
                errors["phone_number"] = phone_number_error

        if "social_name" in attrs:
            social_name_error = validate_social_name(attrs.get("social_name"))
            if social_name_error:
                errors["social_name"] = social_name_error

        if "profile_picture" in attrs:
            profile_picture_error = validate_profile_picture(
                attrs.get("profile_picture")
            )
            if profile_picture_error:
                errors["profile_picture"] = profile_picture_error

        if "emergency_contact" in attrs:
            emergency_contact_error = validate_emergency_contact(
                attrs.get("emergency_contact")
            )
            if emergency_contact_error:
                errors["emergency_contact"] = emergency_contact_error

        if errors:
            logger.error(f"Erros de validação na atualização: {errors}")
            raise serializers.ValidationError(errors)

        return attrs

    def update(self, instance, validated_data):
        """Atualiza os dados do usuário e retorna mensagem apropriada."""
        logger.debug(f"Iniciando a atualização do usuário: {instance.username}")

        fields_to_update = [
            "username",
            "phone_number",
            "social_name",
            "emergency_contact",
        ]
        for field in fields_to_update:
            if field in validated_data:
                setattr(instance, field, validated_data[field])

        # Verificar e atualizar a imagem de perfil apenas se não for URL
        if "profile_picture" in validated_data:
            profile_picture = validated_data["profile_picture"]

            # Verificar se é uma URL
            if isinstance(profile_picture, str) and urlparse(profile_picture).scheme:
                # Caso seja uma URL, você pode ignorar a atualização ou fazer algo específico
                instance.profile_picture = profile_picture
            elif isinstance(
                profile_picture, TemporaryUploadedFile
            ):  # Caso seja um arquivo
                new_filename = generate_new_filename(profile_picture.name)
                instance.profile_picture.save(
                    os.path.join(str(instance.id_user), new_filename),
                    profile_picture,
                    save=True,
                )

        if "password" in validated_data:
            new_password = validated_data["password"]
            instance.set_password(new_password)

        # Tentativa de salvar a instância
        try:
            instance.save()
        except serializers.ValidationError as e:
            logger.error(f"Erro de validação: {e}")
            raise e
        except Exception as e:
            logger.error(f"Erro ao salvar usuário: {e}")
            raise serializers.ValidationError("Erro ao atualizar os dados do usuário.")

        logger.info(f"Usuário '{instance.username}' atualizado com sucesso.")

        return {
            "message": "Os dados do usuário foram alterados com sucesso.",
            "data": {
                "username": instance.username,
                "phone_number": instance.phone_number,
                "social_name": instance.social_name,
                "emergency_contact": instance.emergency_contact,
                "profile_picture": (
                    instance.profile_picture.url if instance.profile_picture else None
                ),
            },
        }


class TokenObtainPairSerializer(TokenObtainPairSerializer):
    """Serializer para obtenção de token JWT."""

    def validate(self, attrs):
        """Valida as credenciais e retorna tokens e dados do usuário."""
        logger.debug("Iniciando a validação do TokenObtainPairSerializer.")
        data = super().validate(attrs)
        user = self.user

        user.authenticated = True
        user.save()

        data["user"] = {
            "email": user.email,
            "id_user": user.id_user,
            "authenticated": user.authenticated,
        }

        logger.info(f"Validação bem-sucedida para o usuário: {user.email}.")
        return data

    def handle_error(self, error):
        """Método para lidar com erros e definir authenticated como false."""
        logger.error(f"Erro na validação do token: {error}.")
        user = self.user
        user.authenticated = False
        user.save()


class BankAccountSerializer(serializers.ModelSerializer):
    """Serializer para gerenciar dados de contas bancárias."""

    class Meta:
        model = models.BankDetails
        fields = [
            "bank_name",
            "account_holder",
            "account_number",
            "agency_code",
            "account_type",
            "cpf",
        ]


class AccommodationSerializer(serializers.ModelSerializer):
    """Serializer para gerenciar dados de acomodações."""

    internal_images = serializers.ListField(
        child=serializers.ImageField(), allow_empty=True
    )

    class Meta:
        model = models.PropertyListing
        fields = [
            "creator",
            "main_cover_image",
            "internal_images",
            "category",
            "room_count",
            "bed_count",
            "bathroom_count",
            "guest_capacity",
            "space_type",
            "address",
            "city",
            "neighborhood",
            "postal_code",
            "complement",
            "wifi",
            "tv",
            "kitchen",
            "washing_machine",
            "parking_included",
            "air_conditioning",
            "pool",
            "jacuzzi",
            "grill",
            "private_gym",
            "beach_access",
            "smoke_detector",
            "fire_extinguisher",
            "first_aid_kit",
            "outdoor_camera",
            "title",
            "description",
            "price_per_night",
            "bank_account",
        ]

    def validate(self, attrs):
        """Valida todos os campos do formulário de acomodação."""
        errors = {}

        # Chamadas de validação
        room_count_error = validate_room_count(attrs.get("room_count"))
        if room_count_error:
            errors["room_count"] = room_count_error

        bed_count_error = validate_bed_count(attrs.get("bed_count"))
        if bed_count_error:
            errors["bed_count"] = bed_count_error

        bathroom_count_error = validate_bathroom_count(attrs.get("bathroom_count"))
        if bathroom_count_error:
            errors["bathroom_count"] = bathroom_count_error

        guest_capacity_error = validate_guest_capacity(attrs.get("guest_capacity"))
        if guest_capacity_error:
            errors["guest_capacity"] = guest_capacity_error

        price_per_night_error = validate_price_per_night(attrs.get("price_per_night"))
        if price_per_night_error:
            errors["price_per_night"] = price_per_night_error

        category_error = validate_category(attrs.get("category"))
        if category_error:
            errors["category"] = category_error

        main_cover_image_error = validate_main_cover_image(
            attrs.get("main_cover_image"), attrs.get("internal_images")
        )
        if main_cover_image_error:
            errors["main_cover_image"] = main_cover_image_error

        # Chamadas para os novos campos de validação
        space_type_error = validate_space_type(attrs.get("space_type"))
        if space_type_error:
            errors["space_type"] = space_type_error

        address_error = validate_address(attrs.get("address"))
        if address_error:
            errors["address"] = address_error

        city_error = validate_city(attrs.get("city"))
        if city_error:
            errors["city"] = city_error

        neighborhood_error = validate_neighborhood(attrs.get("neighborhood"))
        if neighborhood_error:
            errors["neighborhood"] = neighborhood_error

        postal_code_error = validate_postal_code(attrs.get("postal_code"))
        if postal_code_error:
            errors["postal_code"] = postal_code_error

        # Validações de campos booleanos
        wifi_error = validate_wifi(attrs.get("wifi"))
        if wifi_error:
            errors["wifi"] = wifi_error

        tv_error = validate_tv(attrs.get("tv"))
        if tv_error:
            errors["tv"] = tv_error

        kitchen_error = validate_kitchen(attrs.get("kitchen"))
        if kitchen_error:
            errors["kitchen"] = kitchen_error

        washing_machine_error = validate_washing_machine(attrs.get("washing_machine"))
        if washing_machine_error:
            errors["washing_machine"] = washing_machine_error

        parking_included_error = validate_parking_included(
            attrs.get("parking_included")
        )
        if parking_included_error:
            errors["parking_included"] = parking_included_error

        air_conditioning_error = validate_air_conditioning(
            attrs.get("air_conditioning")
        )
        if air_conditioning_error:
            errors["air_conditioning"] = air_conditioning_error

        pool_error = validate_pool(attrs.get("pool"))
        if pool_error:
            errors["pool"] = pool_error

        jacuzzi_error = validate_jacuzzi(attrs.get("jacuzzi"))
        if jacuzzi_error:
            errors["jacuzzi"] = jacuzzi_error

        grill_error = validate_grill(attrs.get("grill"))
        if grill_error:
            errors["grill"] = grill_error

        private_gym_error = validate_private_gym(attrs.get("private_gym"))
        if private_gym_error:
            errors["private_gym"] = private_gym_error

        beach_access_error = validate_beach_access(attrs.get("beach_access"))
        if beach_access_error:
            errors["beach_access"] = beach_access_error

        smoke_detector_error = validate_smoke_detector(attrs.get("smoke_detector"))
        if smoke_detector_error:
            errors["smoke_detector"] = smoke_detector_error

        fire_extinguisher_error = validate_fire_extinguisher(
            attrs.get("fire_extinguisher")
        )
        if fire_extinguisher_error:
            errors["fire_extinguisher"] = fire_extinguisher_error

        first_aid_kit_error = validate_first_aid_kit(attrs.get("first_aid_kit"))
        if first_aid_kit_error:
            errors["first_aid_kit"] = first_aid_kit_error

        outdoor_camera_error = validate_outdoor_camera(attrs.get("outdoor_camera"))
        if outdoor_camera_error:
            errors["outdoor_camera"] = outdoor_camera_error

        if errors:
            logger.error(f"Erros de validação encontrados: {errors}")
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        """Cria e salva uma nova acomodação no banco de dados."""
        logger.info("Iniciando a criação da acomodação.")
        try:
            bank_account_data = validated_data.pop("bank_account", None)
            internal_images = validated_data.pop("internal_images", [])

            # Criação da acomodação
            accommodation = models.PropertyListing.objects.create(**validated_data)
            accommodation_uuid = (
                accommodation.id_accommodation
            )  # Supondo que isso seja o UUID da acomodação
            logger.info(f"Acomodação criada: {accommodation_uuid}.")

            image_paths = []  # Lista para armazenar os caminhos das imagens

            # Renomeia e salva as imagens internas
            for image in internal_images:
                # Verifica se a imagem é um TemporaryUploadedFile
                if isinstance(image, TemporaryUploadedFile):
                    # Gera um novo nome de arquivo com UUID
                    new_filename = (
                        f"{uuid.uuid4()}.jpg"  # Altere a extensão conforme necessário
                    )
                    image_folder = f"property_images/{accommodation_uuid}/"  # Diretório onde as imagens serão salvas
                    file_path = os.path.join(image_folder, new_filename
                    )

                    # Salva a imagem no diretório
                    if default_storage.save(file_path, image):
                        image_paths.append(
                            file_path
                        )  # Adiciona o caminho da imagem à lista

            accommodation.internal_images = list(map(str, image_paths))

            accommodation.save()
            logger.info(f"URLs das imagens armazenadas: {image_paths}.")

            # Criação da conta bancária, se houver
            if bank_account_data:
                bank_account = models.BankDetails.objects.create(**bank_account_data)
                accommodation.bank_account = bank_account
                accommodation.save()
                logger.info(f"Conta bancária associada à acomodação: {bank_account}.")

            return accommodation

        except Exception as e:
            logger.error(f"Ocorreu um erro ao criar acomodação: {str(e)}.")
            raise serializers.ValidationError("Erro ao criar acomodação.")
