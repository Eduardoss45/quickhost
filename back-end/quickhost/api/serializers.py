from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.urls import reverse
from data import models
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


import os
from django.core.files.storage import default_storage


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

        # Cria o usuário e o marca como ativo imediatamente
        user = User.objects.create_user(**validated_data)
        user.is_active = True  # Usuário é ativado imediatamente
        logger.info(
            f"Usuário '{user.username}' criado com sucesso. UUID: {user.id_user}"
        )

        # Lida com a imagem de perfil
        if profile_picture:
            new_filename = generate_new_filename(profile_picture.name)
            user.profile_picture.save(
                os.path.join(str(user.id_user), new_filename),
                profile_picture,
                save=True,
            )

        # Define a senha do usuário
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

        # Validações específicas para cada campo
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

        password_updated = False

        # Atualiza campos do usuário
        instance.username = validated_data.get("username", instance.username)
        instance.phone_number = validated_data.get(
            "phone_number", instance.phone_number
        )
        instance.social_name = validated_data.get("social_name", instance.social_name)
        instance.emergency_contact = validated_data.get(
            "emergency_contact", instance.emergency_contact
        )

        # Atualiza a imagem de perfil
        if "profile_picture" in validated_data:
            profile_picture = validated_data["profile_picture"]
            profile_picture_error = validate_profile_picture(profile_picture)
            if not profile_picture_error:
                instance.profile_picture = profile_picture

        # Atualiza a senha se presente
        if "password" in validated_data:
            new_password = validated_data["password"]
            # Adicione validação para a nova senha se necessário
            instance.set_password(new_password)
            password_updated = True

        # Salva as alterações no banco de dados
        try:
            instance.save()
        except Exception as e:
            logger.error(f"Erro ao salvar usuário: {e}")
            raise serializers.ValidationError("Erro ao atualizar os dados do usuário.")

        logger.info(f"Usuário '{instance.username}' atualizado com sucesso.")

        # Retorna os dados do usuário atualizado
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
        fields = "__all__"

    def create(self, validated_data):
        """Cria e salva uma nova acomodação no banco de dados."""
        logger.info("Iniciando a criação da acomodação.")
        try:
            bank_account_data = validated_data.pop("bank_account", None)
            internal_images = validated_data.pop("internal_images", [])

            logger.debug("Dados da acomodação: %s", validated_data)
            accommodation = models.Accommodation.objects.create(**validated_data)
            logger.info(f"Acomodação criada: {accommodation.id_accommodation}.")

            if internal_images:
                accommodation.internal_images = internal_images
                accommodation.save()
                logger.info(f"URLs das imagens armazenadas: {internal_images}.")

            if bank_account_data:
                bank_account = models.BankAccount.objects.create(**bank_account_data)
                accommodation.bank_account = bank_account
                accommodation.save()
                logger.info(f"Conta bancária associada à acomodação: {bank_account}.")

            return accommodation

        except Exception as e:
            logger.error(f"Ocorreu um erro ao criar acomodação: {str(e)}.")
            raise serializers.ValidationError("Erro ao criar acomodação.")
