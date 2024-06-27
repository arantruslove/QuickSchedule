from django.urls import path

from schedules import views


urlpatterns = [
    path("study-dates-hours-list/", views.study_dates_hours_list_view),
]
