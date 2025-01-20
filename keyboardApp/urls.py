from django.urls import path
from . import views 

urlpatterns=[
    path('shop', views.shop_page),
    path('login', views.login_page),
    path('signup', views.signup_page)
]