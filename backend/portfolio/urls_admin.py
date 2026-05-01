from rest_framework.routers import DefaultRouter

from .views import AdminPortfolioViewSet

router = DefaultRouter()
router.register(r"portfolio", AdminPortfolioViewSet, basename="admin-portfolio")

urlpatterns = router.urls
