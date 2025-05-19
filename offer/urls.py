from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import offer, payment, confidentiality, helpPage, larin

urlpatterns = [
    path('', offer, name="offer"),
    path('payment/', payment, name="payment"),
    path('confidentiality/', confidentiality, name="confidentiality"),
    path('help/', helpPage, name="help"),
    path('larin/', larin, name="larin"),

]