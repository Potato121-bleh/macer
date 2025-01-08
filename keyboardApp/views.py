from django.shortcuts import render

# Create your views here.
def home_page(request):
    return render(request, 'Main.html')
def login_page(request):
    return render(request, 'login.html')
def signup_page(request):
    return render(request, 'signup.html')