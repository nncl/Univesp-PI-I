from django.urls import path

from .views import PortfolioDetailView, PortfolioListView

urlpatterns = [
    path("portfolio/", PortfolioListView.as_view(), name="portfolio_list"),
    path("portfolio/<int:pk>/", PortfolioDetailView.as_view(), name="portfolio_detail"),
]
