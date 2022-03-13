from django.contrib import admin
from techtest.regions.models import Region


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', )
