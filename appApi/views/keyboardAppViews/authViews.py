import base64
import datetime
import os
from django.db import connections, transaction
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpRequest
from django.views.decorators.http import require_http_methods
from keyboardApp.models import User_info
from appApi.util import get_JWT_key
from .middlewareViews import Crediential_validate_middleware
from cryptography.hazmat.primitives import serialization
import json
import jwt
from dotenv import load_dotenv



@require_http_methods(["GET", "POST", "OPTIONS"])
@Crediential_validate_middleware
def auth_user(request: HttpRequest):
    load_dotenv()
    try:
        queried_user = getattr(request, "user_info", "")
        private_key_base64 = os.getenv("PRIVATE_KEY")
        private_key_pem = base64.b64decode(private_key_base64)
        private_key = serialization.load_pem_private_key(
            data=private_key_pem,
            password=None
            )
        
        jwtPayload = {
            "user_id": queried_user.user_id,
            "user_name": queried_user.user_name,
            "user_nickname": queried_user.user_nickname,
            "user_balance": float(queried_user.user_balance),
            "exp": (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)).timestamp()
        }
        print("Data IS HERE")
        print(jwtPayload)
        print(private_key)
        
        jwToken = jwt.encode(
            payload=jwtPayload,
            key=private_key,
            algorithm="RS256"
        )

        response = JsonResponse({ "Message": "Authentication success"})
        response.set_cookie("auth_token", jwToken, httponly=True, samesite="Lax", max_age=3600)
    except Exception as err:
        return JsonResponse({"Message": "Failed to prepare the access token", "ErrorKey": err}, status=500)

    return response


@require_http_methods(["GET", "OPTIONS"])
def auth_validate_user(request: HttpRequest):
    jwtToken = request.COOKIES.get("auth_token")
    if not jwtToken:
        return JsonResponse({"Error_message": "cookie not found"}, status=401)
    try:

        token_payload = jwt.decode(
            jwt=jwtToken,
            key=get_JWT_key("public_key"),
            algorithms=["RS256"]
            )
    except Exception as err:
        return JsonResponse({"Error_Message": "cookie not recongise", "Dev_Message": err})
    return JsonResponse({"Data": token_payload})


def auth_logout(request):
    logout_response = JsonResponse({"Message": "Logout Successfully"}, status=200)
    logout_response.delete_cookie("auth_token")
    return logout_response


@require_http_methods(["POST", "OPTIONS"])
def auth_signUp(request: HttpRequest):
    req_data = json.loads(request.body)
    if not req_data["username"].strip() or not req_data["nickname"].strip() or not req_data["password"].strip():
        return JsonResponse({"Error_Message": "failed to validate the request, Please make sure to request with all required field"}, status=400)
    
    try:
        with transaction.atomic():
            with connections["keyboardAppDB"].cursor() as con:
                con.execute("INSERT INTO keyboardApp_user_info (user_name, user_nickname, user_password, user_balance) VALUES (%s, %s, %s, 0.00)", [req_data["username"], req_data["nickname"], req_data["password"]])
                if con.rowcount != 1:
                    raise Exception("unexpected row affect on insert user")
    except Exception as e:
        print(e)
        return JsonResponse({"Error_Message": "failed to insert new user: DUE " + str(e)}, status=500)
    
    return JsonResponse({"Message": "User has signed up"}, status=200)

    # user_id         = models.AutoField(primary_key=True)
    # user_name       = models.CharField(max_length=12, unique=True)
    # user_nickname   = models.CharField(max_length=12)
    # user_password   = models.TextField()
    # user_balance    = models.DecimalField(max_digits=6, decimal_places=2, default=0)


