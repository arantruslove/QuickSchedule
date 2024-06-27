from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
import pytz
import secrets


class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""

        if not email:
            raise ValueError("The given email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""

        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""

        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)


# Getting all the timezones
TIMEZONE_CHOICES = [(tz, tz) for tz in pytz.all_timezones]


class User(AbstractUser):
    """Custom User model."""

    username = None
    email = models.EmailField(unique=True)
    is_verified = models.BooleanField(default=False)
    time_zone = models.CharField(
        max_length=63, choices=TIMEZONE_CHOICES, default="Europe/London"
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()


# Emal and password reset classes
class EmailVerification(models.Model):
    """Model to track email verification."""

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)

    # kwargs included for the force_insert parameter
    def save(self, **kwargs):
        # Generate a unique token if it doesn't exist
        if not self.token:
            self.token = secrets.token_urlsafe(32)
        super().save(**kwargs)


class PasswordReset(models.Model):
    """Model to track password reset."""

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)

    def save(self, **kwargs):
        if not self.token:
            self.token = secrets.token_urlsafe(32)
        super().save(**kwargs)
