from django.db import models


class ContactRequest(models.Model):
    name = models.CharField("nome", max_length=200)
    phone = models.CharField("telefone", max_length=20)
    tattoo_size = models.CharField("tamanho da tatuagem", max_length=100, blank=True)
    description = models.TextField("descrição")
    suggested_date = models.DateTimeField("data/hora sugerida")
    email = models.EmailField("e-mail", blank=True)
    created_at = models.DateTimeField("criado em", auto_now_add=True)
    updated_at = models.DateTimeField("atualizado em", auto_now=True)

    class Meta:
        verbose_name = "solicitação de orçamento"
        verbose_name_plural = "solicitações de orçamento"
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"{self.name} — {self.suggested_date:%d/%m/%Y %H:%M}"
