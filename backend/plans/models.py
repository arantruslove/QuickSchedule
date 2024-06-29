from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from decimal import Decimal

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
    fraction = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=Decimal("0.00"),
        validators=[
            MinValueValidator(Decimal("0.00")),
            MaxValueValidator(Decimal("1.00")),
        ],
    )
    exam_date = models.DateField(null=True, blank=True, default=None)


class Topic(models.Model):
    """
    Topic that is associated with a Plan instance.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    private_plan = models.ForeignKey(
        PrivatePlan, related_name="topics", on_delete=models.CASCADE, null=True
    )

    title = models.CharField()
    hours = models.FloatField(default=0)
