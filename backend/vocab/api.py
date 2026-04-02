import random
from rest_framework import serializers, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Word, Example, WordType
from rest_framework.views import APIView
from rest_framework.response import Response

def get_session_key(request):
    """ Gets the session key, creating it if 
    none exists. 
    """
    session_key = request.session.session_key
    if session_key is None:
        request.session.create()
        request.session.save()
    session_key = request.session.session_key
    return session_key

class WordTypeChoicesView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        choices = [
            {'value': choice[0], 'label': choice[1]}
            for choice in WordType.choices
        ]
        return Response(choices)


class ExampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Example
        fields = '__all__'

class WordSerializer(serializers.ModelSerializer):
    examples = ExampleSerializer(many=True, read_only=True)  # nested examples

    class Meta:
        model = Word
        fields = ['id', 'spelling', 'definition', 'word_type', 'examples']

class WordViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = WordSerializer

    def get_queryset(self):
        """
        Words are filtered down to just the user's session,
        so if a session doesn't exists we create one
        """
        session_key = get_session_key(self.request)
        return (
                Word.objects.prefetch_related('examples')
                .filter(session_key=session_key)
            )

    def perform_create(self, serializer):
        serializer.save(session_key=self.request.session.session_key)

class ExampleViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = ExampleSerializer

    def get_queryset(self):
        """
        Examples are filtered down to just the user's session,
        so if a session doesn't exists we create one
        """
        session_key = get_session_key(self.request)
        return Example.objects.filter(session_key=session_key)

    def perform_create(self, serializer):
        serializer.save(session_key=self.request.session.session_key)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def generate_quiz(request):
    """
    Generates a quiz using by taking a list of words
    and randomly assigning 3 wrong and 1 right answer
    to each.
    """
    users_words = Word.objects.filter(session_key=request.session.session_key)
    word_ids = request.data.get('word_ids', [])
    if not word_ids:
        all_ids = list(users_words.values_list('id', flat=True))
        word_ids = random.sample(all_ids, min(5, len(all_ids)))

    words = users_words.filter(id__in=word_ids)
    questions = []
    for word in words:
        wrong_words = users_words.exclude(spelling=word.spelling).values('definition').distinct()[:3]
        choices = [word['definition'] for word in wrong_words] + [word.definition]
        random.shuffle(choices)

        questions.append({
            'word_id': word.id,
            'spelling': word.spelling,
            'correct_answer': word.definition,
            'choices': choices,
        })

    return Response({'questions': questions})

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def grade_quiz(request):
    """ Grades the quiz. This could be done just on the front
    end but where's the fun in that??
    """
    original_questions = request.data.get('questions')
    answers = request.data.get('answers')

    resp = []
    for question in original_questions:
        right_answer = question['correct_answer']
        selected_answer = answers.get(question['spelling'])
        resp.append({
            'word': question['spelling'],
            'right': right_answer == selected_answer,
            'correct_answer': right_answer}
        )
    return Response({'grades': resp})

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def create_sample_words(request):
    """
    Creates 3 sample Spanish words for the user's session, meant
    to give users a quick way to seed the database with some values
    """
    session_key = request.session.session_key
    if session_key is None:
        request.session.create()
        request.session.save()
    session_key = request.session.session_key

    sample_words = [
        {
            'spelling': 'hablar',
            'definition': 'to speak',
            'word_type': 'verb',
            'session_key': session_key
        },
        {
            'spelling': 'gato',
            'definition': 'cat',
            'word_type': 'noun',
            'session_key': session_key
        },
        {
            'spelling': 'hermoso',
            'definition': 'beautiful',
            'word_type': 'adjective',
            'session_key': session_key
        }
    ]

    created_words = []
    for word_data in sample_words:
        word = Word.objects.create(**word_data)
        created_words.append(WordSerializer(word).data)

    return Response({'words': created_words})
