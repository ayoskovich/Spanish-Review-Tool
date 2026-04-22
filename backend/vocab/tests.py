from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import Word


def get_session_key(client):
    response = client.get('/api/session/')
    return response.data['session_key']


def session_headers(key):
    return {'HTTP_X_SESSION_KEY': key}


class SessionHandlingTestCase(APITestCase):
    """Tests for session creation and word persistence"""

    def test_create_word_with_session(self):
        """Test that a word is created and stored with the provided session key"""
        key = get_session_key(self.client)
        response = self.client.post('/api/words/', {
            'spelling': 'gato',
            'definition': 'cat',
            'word_type': 'noun'
        }, format='json', **session_headers(key))

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        word = Word.objects.get(spelling='gato')
        self.assertEqual(word.session_key, key)

    def test_list_words_filtered_by_session(self):
        """Test that users only see their own words"""
        client1, client2 = APIClient(), APIClient()
        key1 = get_session_key(client1)
        key2 = get_session_key(client2)

        client1.post('/api/words/', {
            'spelling': 'gato',
            'definition': 'cat',
            'word_type': 'noun'
        }, format='json', **session_headers(key1))

        client2.post('/api/words/', {
            'spelling': 'perro',
            'definition': 'dog',
            'word_type': 'noun'
        }, format='json', **session_headers(key2))

        response1 = client1.get('/api/words/', **session_headers(key1))
        response2 = client2.get('/api/words/', **session_headers(key2))

        self.assertEqual(len(response1.data), 1)
        self.assertEqual(len(response2.data), 1)
        self.assertEqual(response1.data[0]['spelling'], 'gato')
        self.assertEqual(response2.data[0]['spelling'], 'perro')

    def test_separate_clients_have_different_session_id(self):
        """Separate clients should receive different session keys"""
        client1, client2 = APIClient(), APIClient()
        key1 = get_session_key(client1)
        key2 = get_session_key(client2)
        self.assertNotEqual(key1, key2)

    def test_duplicate_word(self):
        key = get_session_key(self.client)
        post_kwargs = {
            'path': '/api/words/',
            'data': {'spelling': 'gato', 'definition': 'cat', 'word_type': 'noun'},
            'format': 'json',
            **session_headers(key),
        }
        resp1 = self.client.post(**post_kwargs)
        failure_msg = 'UNIQUE constraint failed: vocab_word.spelling, vocab_word.session_key'
        with self.assertRaisesRegex(Exception, failure_msg):
            self.client.post(**post_kwargs)

        self.assertEqual(resp1.status_code, status.HTTP_201_CREATED)

    def test_composite_dupe(self):
        """2 separate clients should be able to have the same word"""
        client1, client2 = APIClient(), APIClient()
        key1 = get_session_key(client1)
        key2 = get_session_key(client2)

        post_data = {'spelling': 'gato', 'definition': 'cat', 'word_type': 'noun'}
        resp1 = client1.post('/api/words/', post_data, format='json', **session_headers(key1))
        resp2 = client2.post('/api/words/', post_data, format='json', **session_headers(key2))

        self.assertEqual(resp1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp2.status_code, status.HTTP_201_CREATED)
