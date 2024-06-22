from django.urls import path

from schedules import views


urlpatterns = [path("test-endpoint/", views.test_response)]
