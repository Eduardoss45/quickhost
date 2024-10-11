from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.files.storage import FileSystemStorage
from django.core.files.base import ContentFile
from django.contrib.auth import get_user_model
from rest_framework import serializers
from PIL import Image as PILImage
from django.conf import settings
import logging
from data import models
from io import BytesIO
import logging
import base64
import os

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


from rest_framework import serializers
from django.core.files.uploadedfile import InMemoryUploadedFile


class AccommodationSerializer(serializers.ModelSerializer):
    internal_images = serializers.ListField(
        child=serializers.ImageField(), allow_empty=True
    )

    class Meta:
        model = models.Accommodation
        fields = "__all__"

    def create(self, validated_data):
        logger.info("Iniciando a criação da acomodação.")
        try:
            bank_account_data = validated_data.pop("bank_account", None)
            images = validated_data.pop("internal_images", [])

            logger.debug("Dados da acomodação: %s", validated_data)
            accommodation = models.Accommodation.objects.create(**validated_data)
            logger.info(f"Acomodação criada: {accommodation.id_accommodation}")

            if images:
                image_urls = []
                for image in images:
                    logger.debug(
                        f"Tipo da imagem: {type(image)}, Nome: {getattr(image, 'name', 'N/A')}, Tamanho: {getattr(image, 'size', 'N/A')}"
                    )

                    # Verifica se a imagem é uma instância de InMemoryUploadedFile
                    if not isinstance(image, InMemoryUploadedFile):
                        logger.warning("Imagem inválida recebida.")
                        raise serializers.ValidationError("Imagem inválida.")

                    # Processa a imagem
                    logger.info(f"Processando imagem: {image.name}")
                    image_url = handle_uploaded_image(image)
                    image_urls.append(image_url)
                else:
                    image_urls = []

                accommodation.internal_images = image_urls
                accommodation.save()
                logger.info(f"URLs das imagens armazenadas: {image_urls}")

            if bank_account_data:
                bank_account = models.BankAccount.objects.create(**bank_account_data)
                accommodation.bank_account = bank_account
                accommodation.save()
                logger.info(f"Conta bancária associada à acomodação: {bank_account}")

            return accommodation

        except Exception as e:
            logger.error(f"Ocorreu um erro ao criar acomodação: {str(e)}")
            raise serializers.ValidationError("Erro ao criar acomodação.")


def handle_uploaded_image(image):
    """Função para lidar com o upload de imagens."""
    # Verifica se a imagem é válida
    try:
        img = PILImage.open(image)  # Abre a imagem
        img.verify()  # Verifica se é uma imagem válida
    except Exception as e:
        logger.warning("Imagem inválida recebida: %s", e)
        raise serializers.ValidationError("Imagem inválida.")

    # Define o caminho onde você quer armazenar a imagem
    directory = "media/internal_images/"
    os.makedirs(directory, exist_ok=True)  # Cria o diretório se não existir

    # Usando FileSystemStorage para gerenciar arquivos
    fs = FileSystemStorage(location=directory)
    filename = fs.save(image.name, image)  # Salva a imagem
    file_path = fs.url(filename)  # Obtém a URL do arquivo

    return file_path  # Retorna a URL da imagem
