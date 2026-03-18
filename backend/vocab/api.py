from rest_framework import serializers, viewsets, permissions
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
