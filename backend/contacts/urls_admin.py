from django.urls import path

from .views import AdminContactDetailView, AdminContactListView

urlpatterns = [
    path("contacts/", AdminContactListView.as_view(), name="admin_contacts_list"),
    path("contacts/<int:pk>/", AdminContactDetailView.as_view(), name="admin_contacts_detail"),
]
