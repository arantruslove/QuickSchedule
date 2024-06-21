from django.urls import path

from plans import views

urlpatterns = [
    path("private-plan/", views.private_plan_view, name="private_plan_detail"),
    path("private-plans/", views.private_plan_list_view, name="private_plan_list"),
    path("topic/", views.topic_view, name="topic_detail"),
    path("topic/<int:pk>/", views.topic_view, name="topic_edit"),
    path("topics/", views.topic_list_view, name="topic_list"),
]
