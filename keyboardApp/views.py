from django.shortcuts import render

# Create your views here.
def shop_page(request):
    return render(request, 'shop.html')
def login_page(request):
    return render(request, 'login.html')
def signup_page(request):
    return render(request, 'signup.html')
def testheader(request):
    return render(request, 'navigation/testheader.html')
def home_page(request):
    return render(request, 'home.html')
def about_page(request):
    return render(request, 'about.html')
def footer_page(request):
    return render(request, 'navigation/footer.html')
def checkout_page(request):
    return render(request, 'checkout.html')