from django.urls import path, include
from . import views


urlpatterns = [
    path("test/", views.auth_user)
]

