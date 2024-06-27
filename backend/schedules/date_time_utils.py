import pytz
from datetime import datetime, timedelta, date


def get_current_date_in_timezone(timezone_str: str) -> date:
    """Get the current date given the timezone."""
    timezone = pytz.timezone(timezone_str)
    utc_now = datetime.utcnow().replace(tzinfo=pytz.utc)
    local_time = utc_now.astimezone(timezone)
    local_date = local_time.date()

    return local_date


def get_consecutive_dates(n_days: int, time_zone_str: str) -> list[str]:

    dates_str_list = []
    current_date = get_current_date_in_timezone(time_zone_str)
    for i in range(n_days):
        date = current_date + timedelta(days=i)
        dates_str_list.append(date.strftime("%Y-%m-%d"))

    return dates_str_list
