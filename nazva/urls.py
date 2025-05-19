from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import handler404, handler500
from django.shortcuts import render

urlpatterns = [
    path('admin/', admin.site.urls),
    path('product/', include('product.urls'), name="product"),
    path('', include('user.urls')),
    path('offer/', include('offer.urls')),
    path('basket/', include('basket.urls')),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
