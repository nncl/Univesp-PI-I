from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import LogoutView, MeView

urlpatterns = [
    path("login/", TokenObtainPairView.as_view(), name="auth_login"),
    path("refresh/", TokenRefreshView.as_view(), name="auth_refresh"),
    path("logout/", LogoutView.as_view(), name="auth_logout"),
    path("me/", MeView.as_view(), name="auth_me"),
]
