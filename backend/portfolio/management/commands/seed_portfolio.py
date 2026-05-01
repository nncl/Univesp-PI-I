from django.core.management import call_command
from django.core.management.base import BaseCommand

from portfolio.models import PortfolioItem


class Command(BaseCommand):
    help = "Carrega itens de exemplo do portfólio se a tabela estiver vazia (idempotente)."

    def handle(self, *args, **options):
        if PortfolioItem.objects.exists():
            self.stdout.write("Portfólio já possui itens — pulando seed.")
            return
        call_command("loaddata", "sample_portfolio", verbosity=0)
        count = PortfolioItem.objects.count()
        self.stdout.write(self.style.SUCCESS(f"{count} itens de exemplo carregados."))
