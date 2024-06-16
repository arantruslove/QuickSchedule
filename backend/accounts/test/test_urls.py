from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from django.contrib.auth import get_user_model

from accounts.models import EmailVerification

User = get_user_model()


class SignUp(TestCase):
    """Testing the sign-up endpoint."""

    def setUp(self):
        self.client = APIClient()
        self.url = reverse("sign_up")  # Resolves to /sign-up/

    def test_successful_sign_up(self):
        data = {
            "email": "newuser@example.com",
            "password": "testpassword123",
        }
        response = self.client.post(self.url, data, format="json")
        user = User.objects.get(email="newuser@example.com")

        self.assertEqual(response.status_code, 201)
        self.assertTrue(user.check_password("testpassword123"))
        self.assertFalse(user.check_password("wrongpassword"))

    def test_no_email(self):
        data = {
            "password": "testpassword123",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_invalid_email(self):
        data = {
            "email": "invalid-email",
            "password": "testpassword123",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_email_verification_creation(self):
        data = {
            "email": "newuser@example.com",
            "password": "testpassword123",
        }
        self.client.post(self.url, data, format="json")

        user = User.objects.get(email="newuser@example.com")
        email = EmailVerification.objects.get(user=user)
        self.assertEqual(email.user, user)


class IsEmailTaken(TestCase):
    """Testing the is-email-taken endpoint."""

    def setUp(self):
        self.client = APIClient()
        self.url = reverse("is_email_taken")
        User.objects.create(email="user@example.com", password="foo")

    def test_is_email_taken(self):
        data = {"email": "user@example.com"}
        response = self.client.get(self.url, data, format="json")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["response"], True)

    def test_is_email_not_taken(self):
        data = {"email": "user@another.com"}
        response = self.client.get(self.url, data, format="json")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["response"], False)

    def test_invalid_request(self):
        data = {"other_field": "user@example.com"}
        response = self.client.get(self.url, data, format="json")

        self.assertEqual(response.status_code, 500)


class VerifyEmail(TestCase):
    """Testing the verify-email endpoint."""

    def setUp(self):
        self.client = APIClient()
        self.url = reverse("verify_email")

        # Signing up a user
        data = {
            "email": "newuser@example.com",
            "password": "testpassword123",
        }
        sign_up_url = reverse("sign_up")
        self.client.post(sign_up_url, data, format="json")
        self.user = User.objects.get(email="newuser@example.com")

        verification = EmailVerification.objects.get(user=self.user)
        self.token = verification.token

    def test_successful_email_verification(self):
        data = {"token": self.token}
        response = self.client.post(self.url, data, format="json")
        self.user.refresh_from_db()

        with self.assertRaises(EmailVerification.DoesNotExist):
            EmailVerification.objects.get(user=self.user)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.user.is_verified, True)


class Token(TestCase):
    """Tests the token endpoint."""

    def setUp(self):
        self.client = APIClient()
        self.url = reverse("token_obtain_pair")
        self.user = User.objects.create_user(
            email="newuser@example.com", password="foo"
        )
        self.user.is_verified = True
        self.user.save()

    def test_token_pair_success(self):
        data = {"email": "newuser@example.com", "password": "foo"}
        response = self.client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, 200)
        # Check if the cookies for access and refresh tokens are set
        self.assertIn("rt_data", response.cookies)
        self.assertIn("at_data", response.cookies)

        # Additionally, you can check if the cookies are HTTP-only and their settings
        self.assertTrue(response.cookies["rt_data"]["httponly"])
        self.assertTrue(response.cookies["at_data"]["httponly"])

        # Optional: Check for other cookie attributes such as 'samesite'
        self.assertEqual(response.cookies["rt_data"]["samesite"], "Lax")
        self.assertEqual(response.cookies["at_data"]["samesite"], "Lax")

    def test_not_verified(self):
        self.user.is_verified = False
        self.user.save()

        data = {"email": "newuser@example.com", "password": "foo"}
        response = self.client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, 401)

    def test_not_active(self):
        self.user.is_active = False
        self.user.save()

        data = {"email": "newuser@example.com", "password": "foo"}
        response = self.client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, 401)
