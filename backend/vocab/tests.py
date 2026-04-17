from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import Word


class SessionHandlingTestCase(APITestCase):
    """Tests for session creation and word persistence"""

    def test_create_word_with_session(self):
        """Test that a word is created and stored with a session key"""
        response = self.client.post('/api/words/', {
            'spelling': 'gato',
            'definition': 'cat',
            'word_type': 'noun'
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNotNone(self.client.cookies.get('sessionid'))

        word = Word.objects.get(spelling='gato')
        self.assertEqual(word.session_key, self.client.cookies.get('sessionid').value)

    def test_list_words_filtered_by_session(self):
        """Test that users only see their own words"""
        client1 = APIClient()
        client1.post('/api/words/', {
            'spelling': 'gato',
            'word_type': 'noun'
        }, format='json')

        client2 = APIClient()
        client2.post('/api/words/', {
            'spelling': 'perro',
            'word_type': 'noun'
        }, format='json')

        response1 = client1.get('/api/words/')
        response2 = client2.get('/api/words/')

        self.assertEqual(len(response1.data), 1)
        self.assertEqual(len(response2.data), 1)
        self.assertEqual(response1.data[0]['spelling'], 'gato')
        self.assertEqual(response2.data[0]['spelling'], 'perro')

    def get_session_id_for_client(self, client):
        return client.cookies.get('sessionid')

    def assert_client_session_is_none(self, client):
        session = self.get_session_id_for_client(client)
        self.assertIsNone(session)

    def assert_client_session_is_not_none(self, client):
        session = self.get_session_id_for_client(client)
        self.assertIsNotNone(session)
        return session

    def test_separate_clients_have_different_session_id(self):
        """ Clients don't have a session ID until they make a request, 
        and separate clients should have different session ids. """
        client1, client2 = APIClient(), APIClient()
        self.assert_client_session_is_none(client1)
        self.assert_client_session_is_none(client2)
        client1.get('/api/words/')
        client2.get('/api/words/')
        client1_session_id = self.assert_client_session_is_not_none(client1)
        client2_session_id = self.assert_client_session_is_not_none(client2)
        self.assertNotEqual(client1_session_id, client2_session_id)

    def test_duplicate_word(self):
        post_kwargs = {
            'path': '/api/words/', 
            'data': {'spelling': 'gato', 'word_type': 'noun'}, 
            'format': 'json'
        }
        resp1 = self.client.post(**post_kwargs)
        # At this point, having the same client POST should fail
        failure_msg = 'UNIQUE constraint failed: vocab_word.spelling, vocab_word.session_key'
        with self.assertRaisesRegex(Exception, failure_msg):
            self.client.post(**post_kwargs)

        self.assertEqual(resp1.status_code, status.HTTP_201_CREATED)

    def test_composite_dupe(self):
        """ 2 separate clients should be able to have the same word"""
        post_kwargs = {
            'path': '/api/words/', 
            'data': {'spelling': 'gato', 'word_type': 'noun'}, 
            'format': 'json'
        }
        resp1 = APIClient().post(**post_kwargs)
        resp2 = APIClient().post(**post_kwargs)
        self.assertEqual(resp1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp2.status_code, status.HTTP_201_CREATED)
