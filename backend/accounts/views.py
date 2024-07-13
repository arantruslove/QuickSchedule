from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework.authtoken.models import Token
from urllib.parse import urlsplit

from accounts.serializers import (
    UserSerializer,
    EmailVerificationSerializer,
    PasswordResetSerializer,
)
from accounts.email import send_verification_email, send_password_reset_email
from accounts.models import EmailVerification, User, PasswordReset


@api_view(["POST"])
def sign_up(request):
    """Handles the sign up of a new user."""

    with transaction.atomic():
        # Creates the User and EmailVerification instances
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user = user_serializer.save()
        else:
            return Response(user_serializer.errors, status=400)

        verification_serializer = EmailVerificationSerializer(data={"user": user.id})
        if verification_serializer.is_valid():
            verification = verification_serializer.save()
        else:
            return Response(verification_serializer.errors, status=400)

        # Sends the verification link in an email
        try:
            full_host = request.get_host()
            scheme = request.scheme
            domain = urlsplit(f"//{full_host}").hostname
            base_url = f"{scheme}://{domain}"
            send_verification_email(user, base_url, verification.token)

        except Exception as e:
            return Response({"error": str(e)}, status=500)

        return Response(
            {"response": "User signed up successfully.", "User": user_serializer.data},
            status=201,
        )


@api_view(["GET"])
def is_email_taken(request):
    """Checks if there is already a user with the email."""
    email = request.query_params.get("email")
    if email is None:
        return Response({"error": "No 'email' field has been provided."}, status=500)

    User = get_user_model()
    is_taken = User.objects.filter(email=email).exists()

    if is_taken:
        return Response({"response": True})
    else:
        return Response({"response": False})


@api_view(["POST"])
def verify_email(request):
    """Verifies a users account by setting is_active = True."""
    try:
        with transaction.atomic():
            token = request.data.get("token")

            # Setting the user as active and deleting its EmailVerification instance
            email_verification = EmailVerification.objects.get(token=token)
            user = email_verification.user
            user.is_verified = True
            user.save()
            email_verification.delete()

            return Response(
                {"response": "Account successfully verified."},
            )

    except EmailVerification.DoesNotExist:
        return Response(
            {"error": "Invalid verification token."}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["POST"])
def get_auth_token(request):
    """
    Handles user login by returning an access token.

    request.data fields:
    - email
    - password
    """

    email = request.data.get("email")
    password = request.data.get("password")
    user = authenticate(request, email=email, password=password)

    if user is not None:
        # Obtain the current token if one already exists
        if Token.objects.filter(user=user).exists():
            token = Token.objects.get(user=user)
        # Create a new token if one does not exist
        else:
            token = Token.objects.create(user=user)
    else:
        return Response(
            {"detail": "No account with this username or password."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    # Setting the httpOnly cookie
    response = Response({"detail": "Authentication token set"})
    response.set_cookie(
        key="auth_token",
        value=token.key,
        httponly=False,
        secure=True,
        samesite="Lax",
    )

    return response


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_auth_status(request):
    """Checks if the user is authenticated."""
    return Response({"detail": "The user is authenticated."})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    """Log out user by removing their authentication token."""
    response = Response({"detail": "Authenticated token deleted."})
    response.delete_cookie("auth_token")
    return response


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_user(request):
    """Hard deletion of the user's account."""
    request.user.delete()
    response = Response({"detail": "User deleted."})
    # Logging out
    response.delete_cookie("auth_token")
    return response


@api_view(["POST"])
def initiate_password_reset(request):
    """
    Initiates the password reset process by creating a PasswordReset model
    instance and sending the weblink to reset the password.
    """

    # Getting the user by email
    email = request.data.get("email")
    try:
        user = User.objects.get(email=email)

    except User.DoesNotExist:
        return Response(
            {"detail": "No user with the provided email."},
            status=status.HTTP_404_NOT_FOUND,
        )

    # Proceed with password reset
    with transaction.atomic():
        # Delete any existing PasswordReset instances for the user
        PasswordReset.objects.filter(user=user).delete()
        
        serializer = PasswordResetSerializer(data={"user": user.id})
        if serializer.is_valid():
            password_reset = serializer.save()

        # Send password reset email
        full_host = request.get_host()
        scheme = request.scheme
        domain = urlsplit(f"//{full_host}").hostname
        base_url = f"{scheme}://{domain}"
        send_password_reset_email(user, base_url, password_reset.token)

    return Response({"detail": "Password reset email sent."})


@api_view(["POST"])
def complete_password_reset(request):
    """
    Completes the password reset when the user provides their new password.
    """
    new_password = request.data["new_password"]
    reset_token = request.data["token"]

    # Getting the associated PasswordReset model instance by the token in the url
    try:
        password_reset = PasswordReset.objects.get(token=reset_token)
    except:
        return Response(
            {"details": "The token provided is not valid."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Getting the user and changing its password
    user = password_reset.user
    user.set_password(new_password)
    user.save()
    password_reset.delete()

    # Log out all users by removing current authentication token
    auth_token = Token.objects.get(user=user)
    auth_token.delete()

    return Response({"detail": "Your password has been changed."})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def account_details(request):
    """Fetch the users account details."""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
