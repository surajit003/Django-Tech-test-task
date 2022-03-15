# -*- coding: utf-8 -*-
import json

from django.test import TestCase

from techtest.regions.models import Region


class RegionTestCase(TestCase):
    def setUp(self):
        Region.objects.create(code="UK", name="United Kingdom")

    def test_get_region(self):
        region = Region.objects.get(code="UK")
        resp = self.client.get(f"/api/v1/region/{region.id}/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json(), {"id": 1, "code": "UK", "name": "United Kingdom"})

    def test_post_region(self):
        post_data = {"code": "US", "name": "United States"}
        resp = self.client.post(
            f"/api/v1/regions/",
            data=json.dumps(post_data),
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 201)
        region = Region.objects.get(code="US")
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(region.name, "United States")
        self.assertEqual(region.code, "US")

    def test_put_region(self):
        region = Region.objects.get(code="UK")
        post_data = {"code": "UK", "name": "Great Britain"}

        resp = self.client.put(
            f"/api/v1/region/{region.id}/",
            data=json.dumps(post_data),
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 200)
        region = Region.objects.get(code="UK")
        self.assertEqual(region.name, "Great Britain")

    def test_delete_region(self):
        region = Region.objects.get(code="UK")
        resp = self.client.delete(f"/api/v1/region/{region.id}/")
        region_count = Region.objects.filter(code="US").count()
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(region_count, 0)
