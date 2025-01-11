from django.http import HttpResponse, JsonResponse
from dotenv import load_dotenv
from cryptography.hazmat.primitives import serialization
import os
import base64


def get_JWT_key(key_name):
    load_dotenv()
    if key_name == "private_key" or key_name == "public_key":
        if key_name == "private_key":
            private_key_base64_format = os.getenv("PRIVATE_KEY")
            private_key_pem_format = base64.b64decode(private_key_base64_format)
            formatted_key = serialization.load_pem_private_key(private_key_pem_format)
            return formatted_key
        else:
            public_key_base64_format = os.getenv("PUBLIC_KEY")
            public_key_pem_format = base64.b64decode(public_key_base64_format)
            formatted_key = serialization.load_pem_public_key(public_key_pem_format)
            return formatted_key
    else:
        return ""
