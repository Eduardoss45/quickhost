from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import viewsets, status, response, exceptions
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework import status
from rest_framework.views import APIView
from pprint import pprint
from django.contrib.auth import get_user_model
from data.models import PropertyListing

from .serializers import (
    AccommodationSerializer,
    UserCreateSerializer,
    UserUpdateSerializer,
    TokenObtainPairSerializer,
    ReviewSerializer,
)
from data import models
from uuid import UUID
import uuid
import logging

logger = logging.getLogger("my_logger")


Acommodation = get_user_model()
User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar usuários."""

    queryset = User.objects.all()

    def get_permissions(self):
        if self.action in ["create", "get_by_uuid"]:
            return [AllowAny()]
        return [permission() for permission in self.permission_classes]

    def get_serializer_class(self):
        """Retorna o serializador apropriado com base na ação."""
        return UserCreateSerializer if self.action == "create" else UserUpdateSerializer

    def _get_user_response(self, user):
        """Método privado para serializar e retornar os dados do usuário."""
        serializer = self.get_serializer(user)
        user_data = serializer.data
        user_data.pop("password", None)
        return Response(user_data)

    def create(self, request, *args, **kwargs):
        """Cria um novo usuário."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        logger.info(f"Novo usuário criado: {serializer.validated_data['username']}")
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        """Lista todos os usuários (protegido)."""
        queryset = self.queryset
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data

        for item in data:
            item.pop("password", None)

        return Response(data)

    def retrieve(self, request, *args, **kwargs):
        """Obtém detalhes de um usuário específico (protegido)."""
        id_user = kwargs.get("pk")
        if not id_user:
            return Response({"detail": "UUID do usuário não fornecido"}, status=400)

        try:
            user = User.objects.get(pk=id_user)
        except User.DoesNotExist:
            return Response({"detail": "Usuário não encontrado"}, status=404)

        return self._get_user_response(user)

    def update(self, request, *args, **kwargs):
        """Atualiza os dados de um usuário específico (protegido)."""
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """Exclui um usuário específico (protegido)."""
        user = self.get_object()
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CustomTokenObtainPairView(TokenObtainPairView):
    """View para obter o par de tokens JWT."""

    serializer_class = TokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        """Sobrescreve o método POST para obter tokens."""
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            logger.info(
                f"Token obtido com sucesso para o usuário: {serializer.validated_data['user']['email']}"
            )
            return Response(
                {
                    "message": "Login realizado com sucesso!",
                    "tokens": serializer.validated_data,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            logger.error(f"Erro durante a obtenção do token: {str(e)}")
            return Response(
                {
                    "error": "Erro ao tentar realizar login. Verifique suas credenciais.",
                    "details": str(e),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


class AccommodationViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar acomodações."""

    serializer_class = AccommodationSerializer
    queryset = models.PropertyListing.objects.all()

    def get_permissions(self):

        permission_classes = (
            [IsAuthenticated]
            if self.action in ["create", "update", "partial_update", "destroy"]
            else [AllowAny]
        )
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        """Cria uma nova acomodação (protegido)."""
        id_received = self.kwargs.get("id_user")

        try:
            user_id = uuid.UUID(str(id_received))
            if not User.objects.filter(id_user=user_id).exists():
                raise exceptions.ValidationError(
                    {"detail": "O ID do usuário não está registrado."}
                )

            request.data["creator"] = user_id

        except ValueError:
            raise exceptions.ValidationError(
                {"detail": "O ID do usuário deve estar no formato UUID."}
            )

        print(f"Dados recebidos:{request.data}")

        return super().create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        """Lista todas as acomodações ou filtra por ID do usuário, se fornecido."""
        user_id = request.query_params.get("user_id")

        if user_id:
            try:
                user_id_uuid = uuid.UUID(user_id)
                self.queryset = self.queryset.filter(property__id_user=user_id_uuid)
            except ValueError:
                return Response(
                    {"detail": "O ID do usuário deve estar no formato UUID."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        serializer = self.get_serializer(self.queryset, many=True)
        data = serializer.data

        for item, original in zip(data, self.queryset):
            item["internal_images"] = original.internal_images or []

        return Response(data)

    def retrieve(self, request, *args, **kwargs):
        """Retorna uma acomodação específica ou todas as acomodações, de forma pública."""
        id_accommodation = kwargs.get("pk")

        if id_accommodation:
            try:

                uuid_id = uuid.UUID(id_accommodation)
                accommodation = self.queryset.filter(id_accommodation=uuid_id).first()
                if accommodation is None:
                    return Response(
                        {"detail": "Acomodação não encontrada."},
                        status=status.HTTP_404_NOT_FOUND,
                    )

                serializer = self.get_serializer(accommodation)
                data = serializer.data

                data["internal_images"] = accommodation.internal_images or []
                return Response(data)
            except ValueError:
                return Response(
                    {"detail": "O ID da acomodação deve estar no formato UUID."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:

            serializer = self.get_serializer(self.queryset, many=True)
            data = serializer.data

            for item, original in zip(data, self.queryset):
                item["internal_images"] = original.internal_images or []
            return Response(data)


class GetByUuidView(APIView):
    def post(self, request):
        uuid_str = request.data.get("uuid")

        if not uuid_str:
            return Response(
                {"error": "UUID não fornecido"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            uuid = UUID(uuid_str)
        except ValueError:
            return Response(
                {"error": "UUID inválido"}, status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.filter(id_user=uuid).first()
        if user:
            return Response(
                {
                    "id_user": str(user.id_user),
                    "email": user.email,
                    "username": user.username,
                    "profile_picture": (
                        user.profile_picture.url if user.profile_picture else None
                    ),
                }
            )

        accommodation = PropertyListing.objects.filter(id_accommodation=uuid).first()
        if accommodation:
            return Response(
                {
                    "id_accommodation": str(accommodation.id_accommodation),
                    "title": accommodation.title,
                }
            )

        return Response(
            {"error": "Nenhum usuário ou acomodação encontrado com este UUID"},
            status=status.HTTP_404_NOT_FOUND,
        )


class ReviewViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar as avaliações de acomodações."""

    queryset = models.Review.objects.all()
    serializer_class = ReviewSerializer

    def get_permissions(self):

        if self.action == "create":
            return [IsAuthenticated()]
        permissions = [permission() for permission in self.permission_classes]
        return permissions

    def create(self, request, *args, **kwargs):
        """Cria uma nova avaliação para uma acomodação."""
        data = request.data

        serializer = self.get_serializer(data=data)

        if not serializer.is_valid():

            return response.Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        comment = data.get("comment")
        rating = data.get("rating")

        try:

            print("REQUEST", request)
            review = serializer.save(user_comment=request.user)

        except Exception as e:
            raise ValidationError("Erro ao criar review.")

        return response.Response(
            self.get_serializer(review).data, status=status.HTTP_201_CREATED
        )

    def list(self, request, *args, **kwargs):
        """Lista todas as avaliações de uma acomodação específica ou todas."""
        accommodation_id = request.query_params.get("accommodation_id", None)

        if accommodation_id:
            reviews = self.queryset.filter(accommodation_id=accommodation_id)
        else:
            reviews = self.queryset.all()

        serializer = self.get_serializer(reviews, many=True)

        return response.Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        """Retorna os detalhes de uma avaliação específica."""
        review = self.get_object()

        serializer = self.get_serializer(review)
        return response.Response(serializer.data)

    def update(self, request, *args, **kwargs):
        """Atualiza uma avaliação existente."""

        review = self.get_object()

        comment = request.data.get("comment")
        rating = request.data.get("rating")
        accommodation_id = request.data.get("accommodation_id")

        if accommodation_id:
            try:
                accommodation = models.PropertyListing.objects.get(
                    id_accommodation=accommodation_id
                )
                review.accommodation = accommodation

            except models.PropertyListing.DoesNotExist:

                raise ValidationError({"detail": "Acomodação não encontrada."})

        if rating is not None:
            review.rating = rating
        if comment:
            review.comment = comment

        review.save()

        return response.Response(self.get_serializer(review).data)

    def destroy(self, request, *args, **kwargs):
        """Deleta uma avaliação específica."""
        review = self.get_object()

        review.delete()

        return response.Response(status=status.HTTP_204_NO_CONTENT)
