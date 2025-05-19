from django.shortcuts import render
from .models import Offer, Confidentiality, Larin


def offer(request):
    try:
        offer = Offer.objects.get(id=1)
    except Offer.DoesNotExist:
        offer = ''
    return render(request, 'offer.html', {'offer': offer})

def payment(request):
    return render(request, 'offer_payment.html')

def confidentiality(request):
    try:
        confidentiality = Confidentiality.objects.get(id=1)
    except Confidentiality.DoesNotExist:
        confidentiality = ''
    return render(request, 'confidentiality.html', {'confidentiality': confidentiality})

def helpPage(request):
    return render(request, 'help.html')

def larin(request):
    try:
        larin = Larin.objects.get(id=1)
    except Larin.DoesNotExist:
        larin = ''
    return render(request, 'larin.html', {'larin': larin})