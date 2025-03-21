from django.urls import path
from . import views 

urlpatterns=[
    path('shop', views.shop_page),
    path('login', views.login_page),
    path('signup', views.signup_page),
    path('header', views.header_page),
    path('home', views.home_page),
    path('about', views.about_page),
    path('footer', views.footer_page),
    path('shop/checkout', views.checkout_page),
    path('history', views.history_page)
]