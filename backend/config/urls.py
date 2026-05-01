from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/", include("portfolio.urls_public")),
    path("api/", include("contacts.urls_public")),
    path("api/admin/", include("portfolio.urls_admin")),
    path("api/admin/", include("contacts.urls_admin")),
]
