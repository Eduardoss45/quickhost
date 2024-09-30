from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.files.base import ContentFile
from django.contrib.auth import get_user_model
from rest_framework import serializers
from data import models
import logging
import base64

User = get_user_model()


logger = logging.getLogger(__name__)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id_user",
            "username",
            "birth_date",
            "phone_number",
            "email",
            "password",
            "social_name",
            "profile_picture",
            "emergency_contact",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "username",
            "phone_number",
            "social_name",
            "profile_picture",
            "emergency_contact",
        ]
        extra_kwargs = {field: {"required": False} for field in fields}

    def validate(self, data):
        if "profile_picture" in data:
            if isinstance(data["profile_picture"], str) and data[
                "profile_picture"
            ].startswith("http"):
                del data["profile_picture"]
        return super().validate(data)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data["user"] = {
            "email": user.email,
            "id_user": user.id_user,
        }
        return data


class BankAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.BankAccount
        fields = {
            "bank_name",
            "account_holder",
            "account_number",
            "agency_code",
            "account_type",
            "cpf",
        }

    def validate(self, data):
        print("Dados recebidos para validação:", data)

        required_fields = {
            "bank_name",
            "account_holder",
            "account_number",
            "agency_code",
            "account_type",
            "cpf",
        }
        missing_fields = [
            field for field in required_fields if field not in data or not data[field]
        ]
        if missing_fields:
            raise serializers.ValidationError(
                f"Campos obrigatórios ausentes: {', '.join(missing_fields)}."
            )
        return data


class AccommodationSerializer(serializers.ModelSerializer):
    internal_images = serializers.FileField(required=False)

    class Meta:
        model = models.Accommodation
        fields = "__all__"

    def create(self, validated_data):
        try:

            bank_account_data = validated_data.pop("bank_account", None)

            if isinstance(validated_data.get("internal_images"), str):
                format, imgstr = validated_data["internal_images"].split(";base64,")
                ext = format.split("/")[-1]
                file_name = f"image.{ext}"
                validated_data["internal_images"] = ContentFile(
                    base64.b64decode(imgstr), name=file_name
                )

            accommodation = models.Accommodation.objects.create(**validated_data)

            if bank_account_data:

                bank_account = models.BankAccount.objects.create(**bank_account_data)

                accommodation.bank_account = bank_account
                accommodation.save()

            return accommodation
        except Exception as e:
            logger.error(f"Ocorreu um erro ao criar acomodação: {str(e)}")
            raise serializers.ValidationError("Erro ao criar acomodação.")
