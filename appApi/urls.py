from django.urls import path, include
from . import views


urlpatterns = [
    path("keyboardApp/auth/login", views.auth_user),
    path("keyboardApp/auth/validation", views.auth_validate_user)
]

