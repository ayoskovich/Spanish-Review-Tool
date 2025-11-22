from django import forms
from .models import Word, Example

bootstrap_attrs = {"class": "form-control"}


class WordForm(forms.ModelForm):

    class Meta:
        model = Word
        fields = ["spelling", "definition", "word_type"]
        labels = {
            "spelling": "Spelled",
            "definition": "Definition",
            "word_type": "Type of word",
        }
        widgets = {
            "spelling": forms.TextInput(attrs=bootstrap_attrs),
            "definition": forms.TextInput(attrs=bootstrap_attrs),
            "word_type": forms.Select(attrs={"class": "form-select"}),
        }


class ExampleForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        session_key = kwargs.pop("the_session_key")
        super().__init__(*args, **kwargs)
        self.fields["words_used"].queryset = Word.objects.filter(
            session_key=session_key
        )

    words_used = forms.ModelMultipleChoiceField(
        queryset=Word.objects.none(),
        widget=forms.SelectMultiple(attrs={"class": "form-select"}),
        label="What words are used in this sentence?",
    )

    class Meta:
        model = Example
        fields = ["text", "words_used"]
        labels = {
            "text": "Enter the text",
        }
        widgets = {
            "text": forms.Textarea(attrs=bootstrap_attrs),
        }
