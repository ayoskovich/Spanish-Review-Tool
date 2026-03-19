from django.urls import path, include
from rest_framework import routers

from . import api

router = routers.DefaultRouter()
router.register(r"words", api.WordViewSet)
router.register(r"examples", api.ExampleViewSet)

urlpatterns = [
    path("api/", include(router.urls)),
    path('api/quiz/', api.generate_quiz)
]
