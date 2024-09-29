from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView

from quickhost.api import viewsets as accommodationsviewsets
from quickhost.api.viewsets import (
    UserCreate,
    MyTokenObtainPairView,
    UserUpdate,
    UserDetailView,
)

# Criação do roteador
route = routers.DefaultRouter()

# Registro do ViewSet de acomodações
route.register(
    r"accommodations",
    accommodationsviewsets.AccommodationsViewSet,
    basename="Accommodations",
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", UserCreate.as_view(), name="user-register"),
    path("user/<uuid:id_user>/", UserDetailView.as_view(), name="user-detail"),
    path("user/update/<uuid:id_user>/", UserUpdate.as_view(), name="user-update"),
    path(
        "user/accommodation/create/<uuid:id_user>/",
        accommodationsviewsets.AccommodationsViewSet.as_view({"post": "create"}),
        name="user-accommodation",
    ),
    path("", include(route.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
