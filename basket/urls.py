from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import basket, payment_success, buy_product

urlpatterns = [
    path('', basket, name='basket'),
    path("payment-success/<str:order_id>/", payment_success, name="payment_success"),
    path("buy_product/<int:product_id>/", buy_product, name="buy_product"),
]