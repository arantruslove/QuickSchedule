import os


def get_config():
    """Fetches the environment variables and sets them as the config dictionary."""

    # List of configuration keys you expect in both AWS secrets and environment variables
    config_keys = [
        "DEBUG",
        "SECRET_KEY",
        "TRUSTED_ORIGINS",
        "ALLOWED_HOSTS",
        "EMAIL_HOST",
        "EMAIL_HOST_USER",
        "EMAIL_BACKEND",
        "EMAIL_HOST_PASSWORD",
        "DB_NAME",
        "DB_USER",
        "DB_PASSWORD",
        "DB_HOST",
        "DB_PORT",
    ]
    # Load from environment variables
    config = {}
    for key in config_keys:
        config[key] = os.environ.get(key, None)
    return config


config = get_config()
