from django.urls import path
from . import views

urlpatterns = [
    path("", views.WordListView.as_view(), name="all-words"),
    path("word/<int:pk>/", views.UpdateWord.as_view(), name="word-detail"),
    path("word/create/", views.WordCreateView.as_view(), name="create-word"),
    path("deleteword/<int:pk>", views.DeleteWord.as_view(), name="delete-word"),
    path("about/", views.about, name="about"),
    path("examples/", views.ExampleList.as_view(), name="examples"),
    path("examples/create/", views.CreateExample.as_view(), name="create-example"),
    path("examples/<int:pk>", views.UpdateExample.as_view(), name="example-detail"),
    path(
        "deleteexample/<int:pk>", views.DeleteExample.as_view(), name="delete-example"
    ),
]
