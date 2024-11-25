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
from data.models import PropertyListing, UserAccount, Booking
from django.db.models import Avg

from .serializers import (
    AccommodationSerializer,
    UserCreateSerializer,
    UserUpdateSerializer,
    TokenObtainPairSerializer,
    ReviewSerializer,
    BookingSerializer,
)
from data import models
from uuid import UUID
import uuid
import logging
import re


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
        # Verifica se os dados estão vazios
        if not request.data:
            raise exceptions.ValidationError(
                {"detail": "Os dados não podem estar vazios."}
            )

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

        # Verificando se o UUID corresponde a um usuário
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
                    "phone_number": (user.phone_number),
                }
            )

        # Verificando se o UUID corresponde a uma acomodação
        accommodation = PropertyListing.objects.filter(id_accommodation=uuid).first()
        if accommodation:
            return Response(
                {
                    "id_accommodation": str(accommodation.id_accommodation),
                    "title": accommodation.title,
                }
            )

        # Verificando se o UUID corresponde a uma reserva
        booking = Booking.objects.filter(id_booking=uuid).first()
        if booking:
            return Response(
                {
                    "accommodation": str(booking.accommodation.id_accommodation),
                    "check_in_date": str(booking.check_in_date),
                    "check_out_date": str(booking.check_out_date),
                }
            )

        # Caso não encontre nenhum dado
        return Response(
            {
                "error": "Nenhum dado relacionado a (usuário, acomodação, reservas) encontrado com este UUID"
            },
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
            logger.error(f"Erro na validação dos dados: {serializer.errors}")
            return response.Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )
        comment = data.get("comment")
        rating = data.get("rating")
        try:
            review = serializer.save(user_comment=request.user)
            logger.info(
                f"Avaliação criada: {review.id_review} para a acomodação {review.accommodation.id_accommodation}"
            )
            # Atualizar a média da acomodação após criar a avaliação
            self.update_average_rating(review.accommodation)
            logger.info(
                f"Média de avaliação atualizada para a acomodação {review.accommodation.id_accommodation}: {review.accommodation.average_rating}"
            )
        except Exception as e:
            logger.error(f"Erro ao criar avaliação: {str(e)}")
            raise ValidationError("Erro ao criar review.", e)
        return response.Response(
            self.get_serializer(review).data, status=status.HTTP_201_CREATED
        )

    def list(self, request, *args, **kwargs):
        """Lista todas as avaliações ou avaliações de uma acomodação específica."""
        accommodation_id = request.query_params.get("accommodation_id", None)

        if accommodation_id:
            reviews = self.queryset.filter(accommodation_id=accommodation_id)
            logger.info(f"Listando avaliações para a acomodação {accommodation_id}")
        else:
            reviews = self.queryset.all()
            logger.info("Listando todas as avaliações.")

        serializer = self.get_serializer(reviews, many=True)
        return response.Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        """Retorna os detalhes de uma avaliação ou todas de uma acomodação."""
        identifier = kwargs.get("pk")  # Captura o UUID da rota
        logger.info(f"Buscando avaliação com identificador: {identifier}")

        # Tentar buscar por id_review
        try:
            review = self.queryset.get(id_review=identifier)
            serializer = self.get_serializer(review)
            logger.info(f"Avaliação encontrada: {review.id_review}")
            return response.Response(serializer.data)
        except models.Review.DoesNotExist:
            logger.warning(f"Avaliação {identifier} não encontrada.")

        # Tentar buscar por id_accommodation
        try:
            accommodation = models.PropertyListing.objects.get(
                id_accommodation=identifier
            )
            reviews = self.queryset.filter(accommodation=accommodation)
            serializer = self.get_serializer(reviews, many=True)
            logger.info(f"Acomodações encontradas para o id {identifier}.")

            # Modificando o campo 'user_comment' nos dados
            new_data = serializer.data
            for review in new_data:
                user_comment = review.get("user_comment")

                # Extraímos o e-mail da string entre parênteses
                match = re.search(r"\((.*?)\)", user_comment)
                if match:
                    user_email = match.group(1)  # E-mail extraído
                    try:
                        # Buscar o usuário baseado no e-mail (chave única)
                        user = models.UserAccount.objects.get(email=user_email)
                        review["user_comment"] = str(
                            user.id_user
                        )  # Substitui pelo UUID
                    except models.UserAccount.DoesNotExist:
                        # Caso o usuário não seja encontrado, deixar como estava
                        review["user_comment"] = "Usuário não encontrado"
                else:
                    review["user_comment"] = "Formato de e-mail inválido"

            return response.Response(new_data)
        except models.PropertyListing.DoesNotExist:
            logger.error(f"Acomodação {identifier} não encontrada.")
            return response.Response(
                {"detail": "Nenhuma avaliação ou acomodação encontrada."},
                status=status.HTTP_404_NOT_FOUND,
            )

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
                logger.info(
                    f"Acomodação {accommodation_id} associada à avaliação {review.id_review}"
                )
            except models.PropertyListing.DoesNotExist:
                logger.error(f"Acomodação {accommodation_id} não encontrada.")
                raise ValidationError({"detail": "Acomodação não encontrada."})

        if rating is not None:
            review.rating = rating
            logger.info(
                f"Avaliação {review.id_review} atualizada com novo rating: {rating}"
            )
        if comment:
            review.comment = comment
            logger.info(f"Avaliação {review.id_review} atualizada com novo comentário.")

        review.save()

        # Atualizar a média da acomodação após atualizar a avaliação
        self.update_average_rating(review.accommodation)
        logger.info(
            f"Média de avaliação atualizada para a acomodação {review.accommodation.id_accommodation}: {review.accommodation.average_rating}"
        )

        return response.Response(self.get_serializer(review).data)

    def destroy(self, request, *args, **kwargs):
        """Deleta uma avaliação específica."""
        review = self.get_object()

        accommodation = review.accommodation
        review.delete()

        # Atualizar a média da acomodação após excluir a avaliação
        self.update_average_rating(accommodation)
        logger.info(
            f"Avaliação {review.id_review} excluída e média atualizada para a acomodação {accommodation.id_accommodation}."
        )

        return response.Response(status=status.HTTP_204_NO_CONTENT)

    def update_average_rating(self, accommodation):
        """Atualiza a média das avaliações de uma acomodação."""
        reviews = accommodation.reviews.all()  # Acessa todas as avaliações associadas
        if reviews.exists():
            average = reviews.aggregate(Avg("rating"))["rating__avg"]
            accommodation.average_rating = round(average, 2)
            logger.info(
                f"Nova média calculada para acomodação {accommodation.id_accommodation}: {accommodation.average_rating}"
            )
        else:
            accommodation.average_rating = 0.00
            logger.info(
                f"Nenhuma avaliação encontrada. Média definida como 0 para a acomodação {accommodation.id_accommodation}."
            )
        accommodation.save()


class BookingViewSet(viewsets.ModelViewSet):
    queryset = models.Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filtra as reservas pelo usuário autenticado."""
        return self.queryset.filter(user_booking=self.request.user)

    def perform_create(self, serializer):
        """Define o usuário autenticado como `user_booking` ao salvar a reserva."""
        serializer.save(user_booking=self.request.user)

    def create(self, request, *args, **kwargs):
        """Cria uma nova reserva para uma acomodação."""
        logger.info(f"Tentativa de criar reserva por usuário {request.user}")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        logger.info(f"Reserva criada com sucesso: {serializer.data}")
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        """Lista todas as reservas do usuário autenticado."""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        logger.info(f"Listando reservas para o usuário {request.user}")
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        """Obtém os detalhes de uma reserva específica."""
        try:
            booking = self.get_queryset().get(pk=kwargs["pk"])
        except models.Booking.DoesNotExist:
            logger.warning(
                f"Reserva {kwargs['pk']} não encontrada para o usuário {request.user}"
            )
            return Response(
                {"detail": "Reserva não encontrada."}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(booking)
        logger.info(
            f"Detalhes da reserva {kwargs['pk']} retornados para {request.user}"
        )
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        """Atualiza os detalhes de uma reserva específica."""
        booking = self.get_object()
        serializer = self.get_serializer(booking, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        logger.info(f"Reserva {booking.id_booking} atualizada por {request.user}")
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """Exclui uma reserva específica."""
        booking = self.get_object()
        logger.info(f"Reserva {booking.id_booking} excluída por {request.user}")
        booking.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
