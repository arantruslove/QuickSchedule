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


class Topic(models.Model):
    """
    Topic that is associated with a Plan instance.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    private_plan = models.ForeignKey(PrivatePlan, on_delete=models.CASCADE)

    title = models.CharField()
