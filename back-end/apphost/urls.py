"""
URL configuration for apphost project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


from apphost.api import viewsets as accommodationsviewsets
from apphost.api.viewsets import UserCreate


route = routers.DefaultRouter()

route.register(
    r"accommodations",
    accommodationsviewsets.AccommodationsViewSet,
    basename="Accommodations",
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("token/", TokenObtainPairView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("register/", UserCreate.as_view(), name="user-register"),
    path("", include(route.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
