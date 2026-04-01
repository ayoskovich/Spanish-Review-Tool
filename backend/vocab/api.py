import random
from rest_framework import serializers, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from .models import Word, Example, WordType
from rest_framework.views import APIView
from rest_framework.response import Response

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
        session_key = self.request.session.session_key
        if session_key is None:
            self.request.session.create()
            self.request.session.save()
        session_key = self.request.session.session_key
        return (
                Word.objects.prefetch_related('examples')
                .filter(session_key=session_key)
            )

    def perform_create(self, serializer):
        serializer.save(session_key=self.request.session.session_key)

class ExampleViewSet(viewsets.ModelViewSet):
    queryset = Example.objects.all()
    serializer_class = ExampleSerializer

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
        wrong = users_words.exclude(id=word.id).order_by('?')[:3]
        choices = [w.definition for w in wrong] + [word.definition]
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
    if not answers:
        print('v bad...')
        return Response({'very bad': 42})

    resp = []
    for question in original_questions:
        right_answer = question['correct_answer']
        selected_answer = answers.get(question['spelling'])
        resp.append({
            'word': question['spelling'], 
            'right': right_answer == selected_answer}
        )
    print(f'Returning {resp}')
    return Response({'grades': resp})
