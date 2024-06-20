from django.db import models

from accounts.models import User

# Create your models here.


class PrivatePlan(models.Model):
    """
    Study plans that are only accessible by the user themselves and are directly used
    to generate schedules.
    """

    name = models.CharField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Owner
    is_user_author = models.BooleanField()


