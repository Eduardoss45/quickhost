from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import (
    generics,
    viewsets,
    status,
    permissions,
)
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .serializers import (
    AccommodationSerializer,
    UserUpdateSerializer,
    UserSerializer,
    MyTokenObtainPairSerializer,
)
from data import models
import uuid

User = get_user_model()


class UserCreate(generics.CreateAPIView):
    """View para criar novos usuários."""

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)


class UserUpdate(generics.UpdateAPIView):
    """View para atualizar dados do usuário."""

    permission_classes = [IsAuthenticated]
    serializer_class = UserUpdateSerializer

    def get_object(self):
        """Obtém o usuário com base no ID fornecido."""
        id_received = self.kwargs.get("id_user")
        return get_object_or_404(User, id_user=id_received)

    def update(self, request, *args, **kwargs):
        """Atualiza os dados do usuário."""
        user = self.get_object()
        data = request.data.copy()  # Cria uma cópia mutável dos dados

        # Verifica se profile_picture é uma URL e remove do payload
        if "profile_picture" in data:
            if isinstance(data["profile_picture"], str) and data[
                "profile_picture"
            ].startswith("http"):
                del data["profile_picture"]  # Remove a URL do payload

        # Cria uma instância do serializador com os dados e o usuário
        serializer = self.get_serializer(user, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()  # Salva os dados validados
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(generics.RetrieveAPIView):
    """View para obter detalhes do usuário."""

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id_user"


class MyTokenObtainPairView(TokenObtainPairView):
    """View para obter o par de tokens JWT."""

    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        """Sobrescreve o método POST para obter tokens."""
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        except Exception as e:
            # Logar o erro para rastreamento
            logger.error(f"Erro durante a obtenção do token: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AccommodationViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar acomodações."""

    serializer_class = AccommodationSerializer
    queryset = models.Accommodation.objects.all()

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        """Cria uma nova acomodação."""
        id_received = self.kwargs.get("id_user")

        # Verifica se o ID recebido é um UUID válido
        try:
            user_id = uuid.UUID(str(id_received))  # Tenta converter o ID para UUID
        except ValueError:
            raise ValidationError(
                {"detail": "O ID do usuário deve estar no formato UUID."}
            )

        # Verifica se o usuário existe
        if not User.objects.filter(id_user=user_id).exists():
            raise ValidationError({"detail": "O ID do usuário não está registrado."})

        # Verifica se o usuário está autenticado
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Usuário não autenticado. Faça login para continuar."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Adiciona o ID do usuário ao campo property se não estiver presente
        if "property" not in request.data:
            request.data["property"] = request.user.id_user

        # Continua o fluxo normal de criação
        return super().create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        """Lista as acomodações, filtrando por ID do usuário, se fornecido."""
        user_id = request.query_params.get("user_id")
        if user_id:
            self.queryset = self.queryset.filter(property=user_id)
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        """Obtém detalhes da acomodação, verificando permissões."""
        accommodation = self.get_object()
        if accommodation.property != request.user and not request.user.is_staff:
            return Response(
                {"error": "Você não tem permissão para ver essa acomodação."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().retrieve(request, *args, **kwargs)
