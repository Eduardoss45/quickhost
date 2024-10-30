from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import viewsets, status, response, exceptions
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from django.http import HttpResponse
from pprint import pprint  # Remover apos o debug
from django.contrib.auth import get_user_model
from .serializers import (
    AccommodationSerializer,
    UserCreateSerializer,
    UserUpdateSerializer,
    TokenObtainPairSerializer,
)
from data import models
import uuid
import logging

logger = logging.getLogger("my_logger")

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar usuários."""

    queryset = User.objects.all()

    def get_permissions(self):
        permission_classes = (
            [AllowAny] if self.action == "create" else [IsAuthenticated]
        )
        return [permission() for permission in permission_classes]

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

        # Remover campos específicos de todos os usuários na resposta
        for item in data:
            item.pop("password", None)  # Remova o campo 'password'
            # Adicione outros campos que você deseja remover, se necessário

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
        user = self.get_object()  # Obtém o usuário a ser atualizado
        serializer = self.get_serializer(
            user, data=request.data, partial=True
        )  # Cria o serializador com os dados recebidos
        serializer.is_valid(raise_exception=True)  # Valida os dados
        self.perform_update(serializer)  # Realiza a atualização
        return Response(serializer.data)  # Retorna os dados atualizados

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
            if self.action
            in ["create", "update", "partial_update", "destroy", "retrieve"]
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

        # Serializa o queryset normalmente
        serializer = self.get_serializer(self.queryset, many=True)
        data = serializer.data

        # Substitui None pelos caminhos de imagem disponíveis
        for item, original in zip(data, self.queryset):
            item["internal_images"] = original.internal_images or []

        return Response(data)

    def retrieve(self, request, *args, **kwargs):
        """Obtém detalhes da acomodação, verificando permissões (protegido)."""
        accommodation = self.get_object()
        if accommodation.property != request.user and not request.user.is_staff:
            return response.Response(
                {"error": "Você não tem permissão para ver essa acomodação."},
                status=status.HTTP_403_FORBIDDEN,
            )

        return super().retrieve(request, *args, **kwargs)
