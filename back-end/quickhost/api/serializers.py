from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.files.base import ContentFile
from django.contrib.auth import get_user_model
from rest_framework import serializers
from data import models
import logging
import base64

User = get_user_model()

# Configuração do logger
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
        print("Dados recebidos para validação:", data)  # Log dos dados recebidos

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
        fields = "__all__"  # ou liste os campos que você deseja

    def create(self, validated_data):
        try:
            # Extraindo os dados da conta bancária
            bank_account_data = validated_data.pop("bank_account", None)

            # Tratando a imagem se estiver no formato Base64
            if isinstance(validated_data.get("internal_images"), str):
                format, imgstr = validated_data["internal_images"].split(";base64,")
                ext = format.split("/")[-1]  # Obtendo a extensão
                file_name = (
                    f"image.{ext}"  # Você pode criar um nome de arquivo único aqui
                )
                validated_data["internal_images"] = ContentFile(
                    base64.b64decode(imgstr), name=file_name
                )

            # Criando a acomodação
            accommodation = models.Accommodation.objects.create(**validated_data)

            # Verifica se os dados da conta bancária foram fornecidos
            if bank_account_data:
                # Criando a conta bancária
                bank_account = models.BankAccount.objects.create(**bank_account_data)
                # Associando a conta bancária à acomodação
                accommodation.bank_account = bank_account
                accommodation.save()

            return accommodation
        except Exception as e:
            logger.error(f"Ocorreu um erro ao criar acomodação: {str(e)}")
            raise serializers.ValidationError("Erro ao criar acomodação.")
import base64
import io
from PIL import Image
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.files.base import ContentFile

class ImageUploadView(APIView):
    def post(self, request):
        data = request.data
        
        # Supondo que a imagem esteja em base64 sob a chave 'image'
        image_data = data.get('image')
        
        if image_data:
            # Decodificando a imagem
            format, imgstr = image_data.split(';base64,') 
            ext = format.split('/')[-1]  # Obtendo a extensão da imagem
            
            # Converte a string em um objeto de imagem
            image = Image.open(io.BytesIO(base64.b64decode(imgstr)))

            # Salva a imagem convertida
            img_io = io.BytesIO()
            image.save(img_io, format='JPEG')  # Ou qualquer formato desejado
            img_file = ContentFile(img_io.getvalue(), name='image.jpg')
            
            # Aqui você pode salvar a imagem no modelo, por exemplo
            # your_model_instance.image_field.save('image.jpg', img_file)

            return Response({"message": "Imagem salva com sucesso!"}, status=status.HTTP_201_CREATED)
        
        return Response({"error": "Nenhuma imagem fornecida."}, status=status.HTTP_400_BAD_REQUEST)
