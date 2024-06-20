from django.urls import path

from plans import views

urlpatterns = [
    path("private-plan/", views.private_plan_view, name="private_plan_detail"),
]
