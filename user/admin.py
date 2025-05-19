from django.contrib import admin
from .models import Review, Categories

@admin.register(Review)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "review")

@admin.register(Categories)
class CategoriesAdmin(admin.ModelAdmin):
    list_display = ("name",)

