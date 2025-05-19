import os
from django.shortcuts import render, redirect
from django.apps import apps
import json
import urllib.parse
import hashlib
import httpx
from asgiref.sync import sync_to_async
import uuid
from django.http import Http404
from .models import Payment
from dotenv import load_dotenv
from django.urls import reverse


load_dotenv()

Product = apps.get_model("product", "Product")

TERMINAL_KEY = os.getenv("TERMINAL_KEY")
PASSWORD = os.getenv("PASSWORD")


# Генерация токена для безопасности запроса
async def generate_token(terminal_key, password, params, description, orderid, amount):
    data = [
        {"TerminalKey": terminal_key},
        {"Amount": str(amount)},
        {"OrderId": str(orderid)},
        {"Description": description},
        {"Password": password},
    ]

    sorted_data = sorted(data, key=lambda x: list(x.keys())[0])
    concatenated_values = "".join([list(item.values())[0] for item in sorted_data])

    token = hashlib.sha256(concatenated_values.encode("utf-8")).hexdigest()

    return token


# Генерация токена для безопасности запроса
async def generate_token_check(terminal_key, password, paymentid):
    data = [
        {"Password": password},
        {"PaymentId": str(paymentid)},
        {"TerminalKey": terminal_key},
    ]

    sorted_data = sorted(data, key=lambda x: list(x.keys())[0])
    concatenated_values = "".join([list(item.values())[0] for item in sorted_data])

    token = hashlib.sha256(concatenated_values.encode("utf-8")).hexdigest()

    return token


# Запрос на оплату в Tinkoff
async def make_payment(amount, order_id, description, products, email):
    url = "https://securepay.tinkoff.ru/v2/Init"

    receipt_items = [
        {
            "Name": product.name,
            "Price": int(product.price * 100),
            "Quantity": 1,
            "Amount": int(product.price * 100),
            "Tax": "vat10",
        }
        for product in products
    ]

    payload = {
        "TerminalKey": TERMINAL_KEY,
        "Amount": amount,
        "OrderId": order_id,
        "Description": description,
        "Receipt": {
            "Taxation": "osn",  # Тип налогообложения
            "Email": email,  # Тип налогообложения
            "Items": receipt_items,  # Список товаров
        },
    }

    payload["Token"] = await generate_token(
        terminal_key=TERMINAL_KEY,
        password=PASSWORD,
        amount=amount,
        orderid=order_id,
        description=description,
        params=payload,
    )

    headers = {"Content-Type": "application/json"}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            return {"error": f"HTTP {e.response.status_code}: {e.response.text}"}
        except httpx.RequestError as e:
            return {"error": str(e)}


async def check_payment_status(payment_id):
    url = "https://securepay.tinkoff.ru/v2/GetState"

    payload = {
        "TerminalKey": TERMINAL_KEY,
        "PaymentId": payment_id,
        "Token": await generate_token_check(TERMINAL_KEY, PASSWORD, payment_id),
    }

    headers = {"Content-Type": "application/json"}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            return {"error": f"HTTP {e.response.status_code}: {e.response.text}"}
        except httpx.RequestError as e:
            return {"error": str(e)}


@sync_to_async(thread_sensitive=True)
def get_products(product_ids):
    return list(Product.objects.filter(id__in=product_ids))


@sync_to_async(thread_sensitive=True)
def get_payment(order_id):
    return Payment.objects.get(order_id=order_id)


@sync_to_async(thread_sensitive=True)
def save_order_to_session(request, order_id, product_ids):
    request.session[f"order_id"] = [product_ids, order_id]
    request.session.modified = True
    request.session.save()


@sync_to_async(thread_sensitive=True)
def get_order_id_from_session(request):
    return request.session.get(f"order_id", None)


@sync_to_async(thread_sensitive=True)
def get_order_from_session(request, order_id):
    try:
        return request.session[f"order_{order_id}"]
    except KeyError:
        raise Http404("Order not found")


def get_cocky(request):
    cart = request.COOKIES.get("cart", "{}")
    cart = urllib.parse.unquote(cart)

    try:
        cart = json.loads(cart)
    except json.JSONDecodeError:
        cart = {}

    product_ids = list(cart.keys())

    return product_ids, cart


@sync_to_async(thread_sensitive=True)
def create_payment(
    order_id, total_price_kopecks, products, status, paymentId, paymentURL, email
):
    pay = Payment.objects.create(
        order_id=order_id,
        amount=total_price_kopecks,
        description="Оплата заказа",
        status=status,
        paymentId=paymentId,
        paymentURL=paymentURL,
        email=email,
    )
    pay.products.add(*products)
    return pay


@sync_to_async(thread_sensitive=True)
def update_payment(order_id, status):
    pay = Payment.objects.get(order_id=order_id)
    pay.status = status
    pay.save()
    return pay


async def basket(request):
    product_ids, cart = get_cocky(request)
    products = await get_products(product_ids)

    if request.method == "POST" and "buy_all" in request.POST:
        total_price_kopecks = sum(int(product.price * 100) for product in products)
        order_id = str(uuid.uuid4())
        await save_order_to_session(request, order_id, product_ids)

        if total_price_kopecks > 0:
            response = await make_payment(
                total_price_kopecks,
                order_id,
                "Оплата заказа",
                products,
                request.POST["buy_email"],
            )
            await create_payment(
                order_id,
                total_price_kopecks,
                products,
                response["Status"],
                response["PaymentId"],
                response["PaymentURL"],
                request.POST["buy_email"],
            )
            return redirect(response["PaymentURL"])

    # order_id = await get_order_id_from_session(request)
    # if order_id:
    #     payment = await get_payment(order_id[1])
    #     if payment.status == "SUCCESS":
    #         pass
    #     else:
    #         status = await check_payment_status(payment.paymentId)
    #
    #         if status['Status'] == 'CONFIRMED':
    #             return redirect(f'payment-success/{payment.order_id}/')

    return render(request, "basket.html", {"products": products, "cart": cart})


async def payment_success(request, order_id):
    payment = await get_payment(order_id)
    check_payment = await check_payment_status(payment.paymentId)

    if check_payment["Status"] == "CONFIRMED":
        # Используем sync_to_async для получения списка продуктов
        products = await sync_to_async(list)(payment.products.all())
        await update_payment(order_id, "SUCCESS")
        return render(
            request, "payment_success.html", {"order_id": order_id, "order": products}
        )
    else:
        return redirect("/basket/")


async def buy_product(request, product_id):
    email = request.GET.get("email")

    if not email:
        # Если email не передан, перенаправляем обратно на страницу продукта
        return redirect("main")

    products = await get_products([product_id])

    total_price_kopecks = sum(int(product.price * 100) for product in products)
    order_id = str(uuid.uuid4())
    await save_order_to_session(request, order_id, [product_id])

    if total_price_kopecks > 0:
        response = await make_payment(
            total_price_kopecks, order_id, "Оплата заказа", products, email
        )
        await create_payment(
            order_id=order_id,
            total_price_kopecks=total_price_kopecks,
            products=products,
            status=response["Status"],
            paymentId=response["PaymentId"],
            paymentURL=response["PaymentURL"],
            email=email,
        )
        return redirect(response["PaymentURL"])
