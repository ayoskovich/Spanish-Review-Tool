from django.urls import path
from . import views

urlpatterns = [
    path("", views.WordListView.as_view(), name="all-words"),
    path("word/<int:pk>/", views.WordDetailView.as_view(), name="word-detail"),
    path("word/create/", views.WordCreateView.as_view(), name="create-word"),
    path("delete/<int:pk>", views.DeleteWord.as_view(), name="delete-word"),
]
