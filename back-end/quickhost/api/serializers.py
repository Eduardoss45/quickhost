from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from data import models
import json

User = get_user_model()


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
        fields = "__all__"

    def validate(self, data):
        required_fields = [
            "bank_name",
            "account_holder",
            "account_number",
            "agency_code",
            "account_type",
            "cpf",
        ]
        missing_fields = [
            field for field in required_fields if field not in data or not data[field]
        ]
        if missing_fields:
            raise serializers.ValidationError(
                f"Campos obrigatórios ausentes: {', '.join(missing_fields)}."
            )
        return data


class AccommodationsSerializer(serializers.ModelSerializer):
    bank_account = BankAccountSerializer()

    class Meta:
        model = models.Accommodations
        fields = "__all__"

    def create(self, validated_data):
        bank_account_data = validated_data.pop("bank_account")
        accommodations = models.Accommodations.objects.create(**validated_data)

        bank_account_serializer = BankAccountSerializer(data=bank_account_data)
        bank_account_serializer.is_valid(raise_exception=True)
        bank_account = bank_account_serializer.save()

        # Associando a conta bancária à acomodação
        accommodations.bank_account = bank_account
        accommodations.save()

        return accommodations
