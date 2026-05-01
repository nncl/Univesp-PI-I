from django.db import models


class PortfolioItem(models.Model):
    title = models.CharField("título", max_length=200)
    description = models.TextField("descrição")
    image_url = models.URLField("URL da imagem", max_length=1000)
    created_at = models.DateTimeField("criado em", auto_now_add=True)
    updated_at = models.DateTimeField("atualizado em", auto_now=True)

    class Meta:
        verbose_name = "item do portfólio"
        verbose_name_plural = "itens do portfólio"
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return self.title
