from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from .models import ContactRequest
from .serializers import ContactRequestSerializer


class ContactCreateView(generics.CreateAPIView):
    serializer_class = ContactRequestSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {
                "message": (
                    "Solicitação enviada com sucesso! "
                    "Entrarei em contato em breve pelo WhatsApp para confirmar sua data."
                )
            },
            status=status.HTTP_201_CREATED,
        )


class AdminContactListView(generics.ListAPIView):
    queryset = ContactRequest.objects.all()
    serializer_class = ContactRequestSerializer
    permission_classes = [IsAdminUser]


class AdminContactDetailView(generics.RetrieveAPIView):
    queryset = ContactRequest.objects.all()
    serializer_class = ContactRequestSerializer
    permission_classes = [IsAdminUser]
