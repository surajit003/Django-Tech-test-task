from django.urls import path

from techtest.regions import api_views

urlpatterns = [
    path("regions/", api_views.RegionsListView.as_view(), name="api-regions"),
    path("region/<int:region_id>/", api_views.RegionView.as_view(), name="api-region"),
]
