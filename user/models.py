from django.db import models
from product.models import Product

class Review(models.Model):
    name = models.CharField(max_length=100, verbose_name="Имя")
    review = models.TextField(verbose_name="Описание")
    avatar = models.ImageField(verbose_name="Изображение профиля", upload_to='avatars/')

    def __str__(self):
        return f"Отзыв от {self.name}"

class Categories(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название")
    description = models.TextField(verbose_name="Описание", null=True, blank=True)

    products = models.ManyToManyField(Product, related_name="category", verbose_name="Продукты")


