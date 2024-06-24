from django.db import models

from accounts.models import User


# Create your models here.
class ScheduleFormDraft(models.Model):
    """Stores information associated with the user's generate schedule form."""

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    daily_study_hours = models.JSONField(null=True)
    plan_selection_status = models.JSONField(null=True)
    plan_details = models.JSONField(null=True)
