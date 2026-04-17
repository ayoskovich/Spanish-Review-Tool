from django.urls import path, include
from rest_framework import routers

from . import api

router = routers.DefaultRouter()
router.register(r"words", api.WordViewSet, "words")
router.register(r"examples", api.ExampleViewSet, 'examples')

urlpatterns = [
    path("api/", include(router.urls)),
    path('api/word-type-choices/', api.WordTypeChoicesView.as_view()),
    path('api/quiz/', api.generate_quiz),
    path('api/grade-quiz/', api.grade_quiz),
    path('api/sample-words/', api.create_sample_words)
]
