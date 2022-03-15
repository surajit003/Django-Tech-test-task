import json

from django.test import TestCase

from techtest.author.models import Author


class AuthorTestCase(TestCase):

    def setUp(self):
        Author.objects.create(first_name="test", last_name="user")

    def test_get_author(self):
        author = Author.objects.get(first_name="test")
        resp = self.client.get(f'/api/v1/author/{author.id}/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json(), {'id': 1, 'first_name': 'test', 'last_name': 'user'})

    def test_post_author(self):
        post_data = {"first_name": "fake author", "last_name": "fake last_name"}
        resp = self.client.post(f'/api/v1/authors/', data=json.dumps(post_data),
                                content_type="application/json")
        self.assertEqual(resp.status_code, 201)
        author = Author.objects.get(first_name="fake author")
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(author.first_name, "fake author")
        self.assertEqual(author.last_name, "fake last_name")

    def test_put_author(self):
        author = Author.objects.get(first_name="test")
        post_data = {"first_name": "fake test", "last_name": "fake test last_name"}

        resp = self.client.put(f'/api/v1/author/{author.id}/', data=json.dumps(post_data),
                               content_type="application/json")
        self.assertEqual(resp.status_code, 200)
        author = Author.objects.get(first_name="fake test")
        self.assertEqual(author.first_name, author.first_name)
        self.assertEqual(author.last_name, author.last_name)

    def test_delete_Author(self):
        author = Author.objects.get(first_name="test")
        resp = self.client.delete(f'/api/v1/author/{author.id}/')
        author_count = Author.objects.filter(first_name="test").count()
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(author_count, 0)
