from django.shortcuts import render
from .models import Product
from django.core.paginator import Paginator
from .models import Product
from django.apps import apps



def product(request, id):
    product = Product.objects.get(id=id)
    random_products = Product.objects.order_by('?')[:3]
    return render(request, 'product.html', {'product': product, 'random_products': random_products})


def catalog(request, category_name=None):
    products_list = Product.objects.all()

    # Получаем модель Categories через apps.get_model
    Category = apps.get_model('user', 'Categories')

    # Фильтрация по категории

    if category_name:
        category = Category.objects.filter(name__iexact=category_name).first()
        if category:
            products_list = category.products.all()

    # Фильтрация по поисковому запросу
    search_query = request.GET.get('search')
    if search_query:
        products_list = products_list.filter(name__icontains=search_query)

    # Фильтрация по классу
    class_query = request.GET.get('class')
    if class_query:
        products_list = products_list.filter(classUser=class_query)

    # Сортировка
    sort_query = request.GET.get('sort')
    if sort_query == 'min_price':
        products_list = products_list.order_by('price')
    elif sort_query == 'max_price':
        products_list = products_list.order_by('-price')
    elif sort_query == 'newest':
        products_list = products_list.order_by('-created_at')
    elif sort_query == 'oldest':
        products_list = products_list.order_by('created_at')

    # Пагинация
    paginator = Paginator(products_list, 5)
    page_number = request.GET.get('page')
    products = paginator.get_page(page_number)

    return render(request, 'catalog.html', {'products': products, 'category_name': category_name})
