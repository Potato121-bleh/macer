from django.urls import path, include
from . import views


urlpatterns = [
    path("keyboardApp/auth/login", views.auth_user),
    path("keyboardApp/auth/validation", views.auth_validate_user),
    path("keyboardApp/auth/logout", views.auth_logout),
    path("keyboardApp/retrieve-item-data", views.retrieve_item_info),
    path("keyboardApp/perform-transaction", views.user_transaction)
]

