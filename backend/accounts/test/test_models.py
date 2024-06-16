from django.test import TestCase
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.contrib.auth import get_user_model

from accounts.models import EmailVerification

User = get_user_model()


class UserTest(TestCase):
    """Tests for the custom User model."""

    def test_create_user(self):
        user = User.objects.create_user(email="normal@user.com", password="foo")
        self.assertEqual(user.email, "normal@user.com")
        self.assertTrue(user.check_password("foo"))
        self.assertFalse(user.is_superuser)
        self.assertFalse(user.is_staff)

    def test_create_superuser(self):
        admin_user = User.objects.create_superuser("super@user.com", "foo")
        self.assertEqual(admin_user.email, "super@user.com")
        self.assertTrue(admin_user.is_superuser)
        self.assertTrue(admin_user.is_staff)

    def test_user_with_no_email(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(email="", password="foo")

    def test_create_user_with_duplicate_email(self):
        User.objects.create_user(email="unique@user.com", password="foo")
        with self.assertRaises(IntegrityError):
            User.objects.create_user(email="unique@user.com", password="foo")

    def test_invalid_email_format(self):
        with self.assertRaises(ValidationError):
            user = User(email="invalid-email", password="testpass789")
            user.full_clean()

    def test_is_active_status(self):
        """Testing that the User instance is unverified when first created."""
        user = User.objects.create_user(email="inactive@user.com", password="foo")
        self.assertEqual(user.is_verified, False)


class EmailVerificationTest(TestCase):
    """Testing the EmailVerification model."""

    def test_creation(self):
        user = User.objects.create_user(email="normal@user.com", password="foo")
        verification = EmailVerification.objects.create(user=user)
        self.assertEqual(verification.user, user)
        self.assertIsNotNone(verification.token)

    def test_one_to_one_field(self):
        user_1 = User.objects.create_user(email="user1@example.com", password="foo")

        verification_1 = EmailVerification.objects.create(user=user_1)
        with self.assertRaises(IntegrityError):
            verification_2 = EmailVerification.objects.create(user=user_1)

    def test_token_uniqueness(self):
        user_1 = User.objects.create_user(email="user1@example.com", password="foo")
        user_2 = User.objects.create_user(email="user2@example.com", password="foo")

        verification_1 = EmailVerification.objects.create(user=user_1)
        verification_2 = EmailVerification.objects.create(user=user_2)

        self.assertNotEqual(verification_1.token, verification_2.token)
