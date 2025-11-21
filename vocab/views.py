from django.urls import reverse_lazy

from django.views.generic import CreateView, DeleteView, ListView, UpdateView
from .models import Word


class WordListView(ListView):
    """
    Note: The default name will be word_list
    """

    model = Word
    context_object_name = "words"


class WordCreateView(CreateView):
    model = Word
    fields = ["spelling", "example", "word_type"]
    success_url = reverse_lazy("all-words")


class WordDetailView(UpdateView):
    model = Word
    context_object_name = "word"
    fields = ["spelling", "example", "word_type"]
    success_url = reverse_lazy("all-words")


class DeleteWord(DeleteView):
    model = Word
    success_url = reverse_lazy("all-words")
