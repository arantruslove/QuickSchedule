from django.urls import path

from schedules import views


urlpatterns = [
    path("draft/", views.schedule_form_draft_view),
]
