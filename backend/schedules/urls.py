from django.urls import path

from schedules import views


urlpatterns = [
    path("study-date-hour/<int:pk>/", views.study_date_hour_view),
    path("study-date-hour-list/", views.study_date_hour_list_view),
    path("study-date-hour-list/zero/", views.study_date_hour_list_zero),
]
