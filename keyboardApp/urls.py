from django.urls import path
from . import views 

urlpatterns=[
    path('home', views.home_page),
    path('login', views.login_page),
    path('signup', views.signup_page)
]