from django.urls import path

from plans import views

urlpatterns = [
    path("private-plan/", views.private_plan_view, name="private_plan_detail"),
    path("private-plans/", views.private_plan_list_view, name="private_plan_list"),
]
