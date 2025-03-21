from django.shortcuts import render

# Create your views here.
def shop_page(request):
    return render(request, 'shop.html')
def login_page(request):
    return render(request, 'login.html')
def signup_page(request):
    return render(request, 'signup.html')
def header_page(request):
    return render(request, 'navigation/header.html')
def home_page(request):
    return render(request, 'home.html')
def about_page(request):
    return render(request, 'about.html')
def footer_page(request):
    return render(request, 'navigation/footer.html')
def checkout_page(request):
    return render(request, 'checkout.html')
def history_page(request):
    return render(request, 'history.html')