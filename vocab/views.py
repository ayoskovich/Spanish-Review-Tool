from django.urls import reverse_lazy
from django.contrib import messages
from django.shortcuts import render

from django.views.generic import CreateView, DeleteView, ListView, UpdateView
from .models import Word, Example
from .forms import WordForm, ExampleForm


class WordListView(ListView):
    """
    Note: The default name will be word_list
    """

    model = Word

    def get_queryset(self):
        return Word.objects.filter(session_key=self.request.session.session_key)

    context_object_name = "words"


def get_session_key(session):
    if session.session_key is None:
        session.create()
        session["_fake_key"] = True
        session.save()
    assert session.session_key is not None
    return session.session_key


class WordCreateView(CreateView):
    model = Word
    form_class = WordForm
    success_url = reverse_lazy("all-words")

    def form_valid(self, form):
        """
        Assign the users session key to the word
        """
        form.instance.session_key = get_session_key(self.request.session)
        return super().form_valid(form)

    def get_success_url(self):
        messages.success(self.request, "Word created")
        new_word = self.object
        return reverse_lazy("word-detail", kwargs={"pk": new_word.pk})


class UpdateWord(UpdateView):
    model = Word
    context_object_name = "word"
    form_class = WordForm
    success_url = reverse_lazy("all-words")

    def get_success_url(self):
        existing_word = self.object
        messages.success(self.request, "Updates saved!")
        return reverse_lazy("word-detail", kwargs={"pk": existing_word.pk})


class DeleteWord(DeleteView):
    model = Word
    success_url = reverse_lazy("all-words")


class ExampleList(ListView):
    model = Example
    context_object_name = "examples"

    def get_queryset(self):
        return Example.objects.filter(session_key=self.request.session.session_key)


class CreateExample(CreateView):
    model = Example

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs["the_session_key"] = get_session_key(self.request.session)
        return kwargs

    def form_valid(self, form):
        """
        Assign the users session key to the word
        """
        form.instance.session_key = get_session_key(self.request.session)
        return super().form_valid(form)

    def get_success_url(self):
        new_example = self.object
        messages.success(self.request, "Example created!")
        return reverse_lazy("example-detail", kwargs={"pk": new_example.pk})

    form_class = ExampleForm


class UpdateExample(UpdateView):
    model = Example

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs["the_session_key"] = get_session_key(self.request.session)
        return kwargs

    def get_success_url(self):
        new_example = self.object
        messages.success(self.request, "Changes saved!")
        return reverse_lazy("example-detail", kwargs={"pk": new_example.pk})

    form_class = ExampleForm


class DeleteExample(DeleteView):
    model = Example

    def get_success_url(self):
        messages.success(self.request, "Example deleted")
        return reverse_lazy("examples")


def about(request):
    return render(request, "vocab/about.html")


def quiz(request):
    return render(request, "vocab/quiz.html")
