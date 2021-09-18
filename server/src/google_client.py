from googleapiclient.discovery import HttpError, build

"""
For more info on how to use google api:
https://github.com/googleapis/google-api-python-client/blob/main/docs/start.md
"""


def verify_google_token(token):
    with build("oauth2", "v2") as service:
        try:
            token_info_request = service.tokeninfo(access_token=token)
            token_info = token_info_request.execute()
            google_id = token_info["user_id"]
            if google_id:
                return (True, google_id)
            else:
                print(" Couldn't get google id")
                return (False, None)
        except HttpError as e:
            # Invalid token,
            print(
                "Error response status code : {0}, reason : {1}".format(
                    e.status_code, e.error_details
                )
            )
            return (False, None)
