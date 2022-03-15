# -*- coding: utf-8 -*-
import json

from django.test import TestCase

from techtest.articles.models import Article
from techtest.author.models import Author
from techtest.regions.models import Region


class ArticleTestCase(TestCase):
    def setUp(self):
        author = Author.objects.create(first_name="test", last_name="user")
        region = Region.objects.create(code="UK", name="United Kingdom")
        article = Article.objects.create(title="test article", content="test content")
        article.authors.add(author)
        article.regions.add(region)

    def test_get_article(self):
        article = Article.objects.get(title="test article")
        resp = self.client.get(f"/api/v1/article/{article.id}/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(
            resp.json(),
            {
                "id": 1,
                "authors": [{"id": 1, "first_name": "test", "last_name": "user"}],
                "title": "test article",
                "regions": [{"id": 1, "name": "United Kingdom", "code": "UK"}],
                "content": "test content",
            },
        )

    def test_post_article_without_author_region(self):
        post_data = {"title": "fake title", "content": "fake content"}
        resp = self.client.post(
            f"/api/v1/articles/",
            data=json.dumps(post_data),
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 201)
        article = Article.objects.get(title="fake title")
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(article.title, "fake title")
        self.assertEqual(article.content, "fake content")

    def test_post_article_with_author(self):
        author = Author.objects.get(first_name="test")
        post_data = {
            "title": "fake title",
            "content": "fake content",
            "authors": [{"id": author.id}],
        }
        resp = self.client.post(
            "/api/v1/articles/",
            data=json.dumps(post_data),
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 201)
        article = Article.objects.get(title="fake title")
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(article.title, "fake title")
        self.assertEqual(article.content, "fake content")
        self.assertEqual(article.authors.count(), 1)
        self.assertEqual(article.authors.all()[0].first_name, author.first_name)

    def test_post_article_with_region(self):
        region = Region.objects.get(code="UK")
        post_data = {
            "title": "fake title",
            "content": "fake content",
            "regions": [{"id": region.id}],
        }
        resp = self.client.post(
            "/api/v1/articles/",
            data=json.dumps(post_data),
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 201)
        article = Article.objects.get(title="fake title")
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(article.title, "fake title")
        self.assertEqual(article.content, "fake content")
        self.assertEqual(article.regions.count(), 1)
        self.assertEqual(article.regions.all()[0].name, region.name)

    def test_put_article(self):
        article = Article.objects.get(title="test article")
        author = Author.objects.create(first_name="fake", last_name="client")
        region = Region.objects.create(code="US", name="United States")
        post_data = {
            "title": "fake article",
            "content": "fake content",
            "regions": [{"id": region.id}],
            "authors": [{"id": author.id}],
        }
        resp = self.client.put(
            f"/api/v1/article/{article.id}/",
            data=json.dumps(post_data),
            content_type="application/json",
        )
        article = Article.objects.get(title="fake article")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(article.title, "fake article")
        self.assertEqual(article.content, "fake content")
        self.assertEqual(article.authors.all()[0].first_name, author.first_name)
        self.assertEqual(article.regions.all()[0].name, region.name)

    def test_delete_article(self):
        article = Article.objects.get(title="test article")
        resp = self.client.delete(f"/api/v1/article/{article.id}/")
        article_count = Article.objects.filter(title="test article").count()
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(article_count, 0)
