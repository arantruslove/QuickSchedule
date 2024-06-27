from django.db import models

from accounts.models import User


class StudyDateHour(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    date = models.DateField()
    hours = models.DecimalField(max_digits=4, decimal_places=1, default=0)
