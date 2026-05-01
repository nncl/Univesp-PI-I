from django.contrib import admin

from .models import ContactRequest


@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "suggested_date", "created_at")
    search_fields = ("name", "phone", "email", "description")
    list_filter = ("suggested_date", "created_at")
    ordering = ("-created_at",)
