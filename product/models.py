from django.db import models
from ckeditor.fields import RichTextField

class Product(models.Model):
    name = models.CharField(max_length=255, verbose_name="Название")
    description = RichTextField(verbose_name="Описание")
    price = models.IntegerField(verbose_name="Цена")

    number_pages = models.IntegerField(verbose_name="Количество страниц (если оставить пустым, то на странице не будет отображаться)", null=True, blank=True)
    pages = models.IntegerField(verbose_name="Страницы (если оставить пустым, то на странице не будет отображаться)", null=True, blank=True)

    classUser = models.IntegerField(verbose_name="Класс", null=True, blank=True)
    lesson = models.CharField(max_length=100,verbose_name="Предмет", null=True, blank=True)

    file = models.FileField(upload_to="products/material/", verbose_name="Материал урока(zip архив)", blank=True, null=True)
    image1 = models.ImageField(upload_to="products/img/", verbose_name="Изображение 1", blank=True, null=True)
    image2 = models.ImageField(upload_to="products/img/", verbose_name="Изображение 2", blank=True, null=True)
    image3 = models.ImageField(upload_to="products/img/", verbose_name="Изображение 3", blank=True, null=True)
    image4 = models.ImageField(upload_to="products/img/", verbose_name="Изображение 4", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return self.name
