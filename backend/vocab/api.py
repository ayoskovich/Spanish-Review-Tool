import random
from rest_framework import serializers, viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from .models import Word, Example

class ExampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Example
        fields = '__all__'

class WordSerializer(serializers.ModelSerializer):
    examples = ExampleSerializer(many=True, read_only=True)  # nested examples

    class Meta:
        model = Word
        fields = '__all__'

class WordViewSet(viewsets.ModelViewSet):
    queryset = Word.objects.prefetch_related('examples').all()
    serializer_class = WordSerializer
    permission_classes = [permissions.IsAuthenticated]

class ExampleViewSet(viewsets.ModelViewSet):
    queryset = Example.objects.all()
    serializer_class = ExampleSerializer
    permission_classes = [permissions.IsAuthenticated]

@csrf_exempt
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def generate_quiz(request):
    word_ids = request.data.get('word_ids', [])
    if not word_ids:
        all_ids = list(Word.objects.values_list('id', flat=True))
        word_ids = random.sample(all_ids, min(5, len(all_ids)))

    words = Word.objects.filter(id__in=word_ids)
    questions = []
    for word in words:
        wrong = Word.objects.exclude(id=word.id).order_by('?')[:3]
        choices = [w.definition for w in wrong] + [word.definition]
        random.shuffle(choices)

        questions.append({
            'word_id': word.id,
            'spelling': word.spelling,
            'correct_answer': word.definition,
            'choices': choices,
        })

    return Response({'questions': questions})


