from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny, IsAdminUser

from .models import PortfolioItem
from .serializers import PortfolioItemSerializer


class PortfolioListView(generics.ListAPIView):
    queryset = PortfolioItem.objects.all()
    serializer_class = PortfolioItemSerializer
    permission_classes = [AllowAny]


class PortfolioDetailView(generics.RetrieveAPIView):
    queryset = PortfolioItem.objects.all()
    serializer_class = PortfolioItemSerializer
    permission_classes = [AllowAny]


class AdminPortfolioViewSet(viewsets.ModelViewSet):
    queryset = PortfolioItem.objects.all()
    serializer_class = PortfolioItemSerializer
    permission_classes = [IsAdminUser]
