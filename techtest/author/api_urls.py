from django.urls import path

from techtest.author import api_views

urlpatterns = [
    path("authors/", api_views.AuthorsListView.as_view(), name="api-authors"),
    path("author/<int:author_id>/", api_views.AuthorView.as_view(), name="api-author"),
]