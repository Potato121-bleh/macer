from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader


# Create your views here.

def introduction(request): 
    return HttpResponse("<h1>Welcome<h1/>")

def home_page(request):
    #template = loader.get_template
    return render(request, "lessonApp/home.html")