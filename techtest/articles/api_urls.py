from django.urls import path

from techtest.articles import api_views

urlpatterns = [
    path("articles/", api_views.ArticlesListView.as_view(), name="api-articles"),
    path("article/<int:article_id>/", api_views.ArticleView.as_view(), name="api-article"),
]
