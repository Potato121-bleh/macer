from django.urls import path
from . import views


urlpatterns = [
    path("welcome", view=views.introduction),
    path("home", view=views.home_page)
]