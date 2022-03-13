from django.urls import include
from django.urls import path

import techtest.regions.api_urls
import techtest.author.api_urls
import techtest.articles.api_urls

urlpatterns = [
    path('', include(techtest.articles.api_urls)),
    path('', include(techtest.author.api_urls)),
    path('', include(techtest.regions.api_urls)),
]
