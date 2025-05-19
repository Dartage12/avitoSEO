from django.shortcuts import render, redirect
from .models import Review, Categories
from basket.views import get_order_id_from_session, get_payment, check_payment_status
from asgiref.sync import sync_to_async


async def index(request):
    reviews = await sync_to_async(list)(Review.objects.all())
    categories = await sync_to_async(list)(Categories.objects.all())

    order_id = await get_order_id_from_session(request)
    if order_id:
        payment = None
        try:
            payment = await get_payment(order_id[1])
            if payment.status == "SUCCESS":
                pass
            else:
                status = await check_payment_status(payment.paymentId)
                if status["Status"] == "CONFIRMED":
                    return redirect(f"basket/payment-success/{payment.order_id}/")
        except Exception as e:
            if payment is None:
                pass

    return render(request, "index.html", {"reviews": reviews, "categories": categories})
