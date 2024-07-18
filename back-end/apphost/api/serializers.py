from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from data import models

User = get_user_model()

class AccommodationsSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Accommodations
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = [
            "id_user",
            "username",
            "birth_date",
            "phone_number",
            "email",
            "password",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = models.User.objects.create_user(**validated_data)
        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data["user"] = {
            "email": user.email,
            "id": user.id_user,
            # Adicione outros campos do usuário que você deseja retornar com os tokens
        }
        return data