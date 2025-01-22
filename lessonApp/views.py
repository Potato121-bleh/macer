from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader
from .models import User_info, Item_storage


# Create your views here.

def introduction(request): 
    return HttpResponse("<h1>Welcome<h1/>")

def home_page(request):
    #template = loader.get_template
    queried_user_data = Item_storage.objects.all()

    return render(request, "lessonApp/home.html", {"data": queried_user_data})