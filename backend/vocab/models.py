from django.db import models


class WordType(models.TextChoices):
    NOUN = "noun"
    VERB = "verb"
    REFLEXIVE_VERB = "reflexive_verb"
    ADJECTIVE = "adjective"
    ADVERB = "adverb"
    PRONOUN = "pronoun"
    OTHER = "other"


class Word(models.Model):
    """
    An actual word you would use in a sentence
    """

    spelling = models.CharField(max_length=255)
    definition = models.CharField(max_length=255, blank=True, null=True)
    example = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    word_type = models.CharField(max_length=30, choices=WordType.choices)
    session_key = models.CharField(max_length=32)

    def __str__(self):
        if self.definition:
            return f"{self.spelling} ({self.definition})"
        return self.spelling


class Example(models.Model):
    text = models.CharField(max_length=2500)
    # related_name means that you can do word_instance.examples
    words_used = models.ManyToManyField(to=Word, related_name="examples")
    session_key = models.CharField(max_length=32)

    def __str__(self):
        """
        Defining a custom str dunder simplifies list views!
        """
        return f"{self.text} ({self.words_used.count()} words)"
