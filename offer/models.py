from django.db import models
from ckeditor.fields import RichTextField


class Offer(models.Model):
    text =  RichTextField(verbose_name="Текст в оферте")


class Confidentiality(models.Model):
    text =  RichTextField(verbose_name="Текст в конфиденциальности")


class Larin(models.Model):
    text =  RichTextField(verbose_name="Текст в ИП")