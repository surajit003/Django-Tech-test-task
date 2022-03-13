from django.contrib import admin

from techtest.articles.models import Article


@admin.register(Article)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('title', 'content',)
