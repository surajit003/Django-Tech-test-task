from django.contrib import admin

from techtest.author.models import Author


# Register your models here.

@admin.register(Author)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name',)
