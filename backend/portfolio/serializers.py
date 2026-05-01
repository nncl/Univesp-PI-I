from rest_framework import serializers

from .models import PortfolioItem


class PortfolioItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioItem
        fields = ("id", "title", "description", "image_url", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")
