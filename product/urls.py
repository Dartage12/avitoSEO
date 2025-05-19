from django.contrib import admin
from django.urls import path
from .views import product, catalog
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('<int:id>/', product, name='product'),
    path('', catalog, name='catalog'),
    path('category/<str:category_name>/', catalog, name='catalog_by_category'),
]