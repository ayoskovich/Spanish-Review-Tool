from django.db import models


class WordType(models.TextChoices):
    NOUN = "noun"
    VERB = "verb"
    REFLEXIVE_VERB = "reflexive_verb"
    ADJECTIVE = "adjective"
    ADVERB = "adverb"
    PRONOUN = "pronoun"
    OTHER = "other"


class RootWord(models.Model):
    """
    Represents the "root" word, for now just the infinitive form of the word.

    Examples:
    - Tomar (tomo, tomas, toma)
    - Cepillarse
    - Gustar (gusto, gustas, gusta)
    """

    spelling = models.CharField(max_length=255)
    definition = models.TextField()
    example = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.spelling


class Word(models.Model):
    """
    An actual word you would use in a sentence, may or may not
    have a root word related to it.
    """

    root_word = models.ForeignKey(
        RootWord,
        on_delete=models.SET_NULL,
        related_name="words",
        null=True,
    )
    spelling = models.CharField(max_length=255)
    example = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    word_type = models.CharField(max_length=30, choices=WordType.choices)

    def __str__(self):
        return self.spelling
