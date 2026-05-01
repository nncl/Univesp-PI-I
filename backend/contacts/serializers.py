import re

from django.utils import timezone
from rest_framework import serializers

from .models import ContactRequest

_PHONE_DIGITS = re.compile(r"\D+")


class ContactRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactRequest
        fields = (
            "id",
            "name",
            "phone",
            "tattoo_size",
            "description",
            "suggested_date",
            "email",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def validate_phone(self, value: str) -> str:
        digits = _PHONE_DIGITS.sub("", value)
        if len(digits) not in (10, 11):
            raise serializers.ValidationError(
                "Telefone inválido. Use o formato (DD) 9XXXX-XXXX."
            )
        return value

    def validate_suggested_date(self, value):
        if value <= timezone.now():
            raise serializers.ValidationError(
                "A data/hora sugerida deve ser no futuro."
            )
        return value
