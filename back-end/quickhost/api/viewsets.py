from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import (
    generics,
    viewsets,
    status,
    permissions,
)
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .serializers import (
    AccommodationsSerializer,
    UserUpdateSerializer,
    UserSerializer,
    MyTokenObtainPairSerializer,
)
from data import models

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
        content_type = request.content_type

        if content_type in ["application/json", "multipart/form-data"]:
            data = request.data

            # Cria uma instância do serializador com os dados e o usuário
            serializer = self.get_serializer(user, data=data, partial=True)

            if serializer.is_valid():
                serializer.save()  # Salva os dados validados
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            {"error": "Unsupported Content-Type"},
            status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
        )


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
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AccommodationsViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar acomodações."""

    serializer_class = AccommodationsSerializer
    queryset = models.Accommodations.objects.all()

    def get_permissions(self):
        """Define permissões diferentes para métodos distintos."""
        if self.request.method in ["POST", "PUT", "PATCH", "DELETE"]:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def create(self, request, *args, **kwargs):
        request.data["property"] = request.user.id_user
        return super().create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        """Sobrescreve o método list para adicionar lógica customizada, se necessário."""
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        """Sobrescreve o método retrieve para adicionar lógica customizada, se necessário."""
        return super().retrieve(request, *args, **kwargs)
