from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAdminUser

from .models import ContactRequest
from .serializers import ContactRequestSerializer


class ContactCreateView(generics.CreateAPIView):
    serializer_class = ContactRequestSerializer
    permission_classes = [AllowAny]


class AdminContactListView(generics.ListAPIView):
    queryset = ContactRequest.objects.all()
    serializer_class = ContactRequestSerializer
    permission_classes = [IsAdminUser]


class AdminContactDetailView(generics.RetrieveAPIView):
    queryset = ContactRequest.objects.all()
    serializer_class = ContactRequestSerializer
    permission_classes = [IsAdminUser]
