from django.db import models

from accounts.models import User

# Create your models here.


class PrivatePlan(models.Model):
    """
    Study plans that are only accessible by the user themselves and are directly used
    to generate schedules.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    title = models.CharField()
    is_user_author = models.BooleanField()
    is_selected = models.BooleanField(default=False)


class Topic(models.Model):
    """
    Topic that is associated with a Plan instance.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    private_plan = models.ForeignKey(
        PrivatePlan, related_name="topics", on_delete=models.CASCADE, null=True
    )

    title = models.CharField()
    hours = models.FloatField()
