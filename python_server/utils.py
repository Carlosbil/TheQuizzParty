
import base64
import datetime
import os

from dataBase import User, get_session

session = get_session()


def is_token_valid(token_with_timestamp):
    try:
        # Split the token and timestamp
        token, timestamp_str = token_with_timestamp.split("|")
        timestamp = datetime.datetime.strptime(timestamp_str, "%Y-%m-%d %H:%M:%S")

        # Check if the token has expired (more than 24 hours old)
        if (datetime.datetime.now() - timestamp).total_seconds() > 7200 :  # 86400 seconds = 24 hours
            return False
        return True
    except:
        return False


# take a look to the DB for search if the token already exists in another user
def token_exists(token):
    user_with_token = session.query(User).filter_by(token=token).first()
    
    if user_with_token:
        return True
    return False


def generate_token():
    token = base64.urlsafe_b64encode(os.urandom(24)).decode("utf-8")
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    token_with_timestamp = f"{token}|{timestamp}"
    while token_exists(token_with_timestamp):
        token = base64.urlsafe_b64encode(os.urandom(24)).decode("utf-8")
        token_with_timestamp = f"{token}|{timestamp}"
    return token_with_timestamp