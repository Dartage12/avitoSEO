from django.db import models
from product.models import Product


class Payment(models.Model):
    order_id = models.CharField(max_length=255, verbose_name="Идентификатор заказа")
    amount = models.CharField(max_length=255, verbose_name="Цена (В копейках)")
    description = models.TextField(verbose_name="Описание")

    status = models.CharField(max_length=10, verbose_name="Статус платежа", null=True, blank=True)
    paymentId = models.CharField(max_length=255, verbose_name="paymentId", null=True, blank=True)
    paymentURL = models.CharField(max_length=255, verbose_name="PaymentURL", null=True, blank=True)
    email = models.EmailField(verbose_name="Почта пользователя", null=True, blank=True)

    products = models.ManyToManyField(Product, related_name="payments", verbose_name="Продукты")

    created_at = models.DateTimeField(
        verbose_name="Дата создания",
        auto_now_add=True,
        null=True,
    )
