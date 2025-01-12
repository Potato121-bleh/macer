from django.http import HttpResponse, HttpRequest, JsonResponse
from django.db import connections, transaction
from django.views.decorators.http import require_http_methods
from .middlewareViews import Cookie_validation_middleware
from keyboardApp.models import User_info, Transaction, Store_item

import json


# incoming data should look like this:
    # {
    #     item_data = [
    #         [1, 20],
    #         [2, 19]
    #         ]
    # }
@require_http_methods(["POST", "OPTIONS"])
@Cookie_validation_middleware
def user_transaction(request: HttpRequest):
    """
    nice
    """

    request_data = list(json.loads(request.body))
    jwt_payload = getattr(request, "user_info")

    sql_statement = "INSERT INTO Transaction (transaction_user_id, item_id) VALUES "

    # check whether the price is met the requirement
    transaction_price = 0
    for i in request_data["item_data"]:
        transaction_price += i[1]

    try:
        user_balance = User_info.objects.raw("SELECT user_balance FROM User_info WHERE user_id=%s", [jwt_payload["user_id"]])
        if user_balance < transaction_price:
            return JsonResponse({"Error_Message": "Insufficient balance"}, status=400)
        user_balance -= transaction_price
    except Exception as err:
        return JsonResponse({"Error_Message": "Something went wrong", "Dev_Message": err})


    for i in request_data["item_data"]:
        prep_str = "(" + jwt_payload["user_id"] + i[0] + ")"
        sql_statement += prep_str
    
    try:
        with connections["keyboardAppDB"].cursor() as db_cursor:
            transaction.set_autocommit(autocommit=False)

            db_cursor.execute(sql_statement)
            if db_cursor.rowcount != len(request_data):
                transaction.rollback()
                raise SystemError("row affected are weird")
            
            db_cursor.execute("UPDATE User_info SET user_balance = %s WHERE user_id = %s", [user_balance, jwt_payload["user_id"]])
            if db_cursor.rowcount != 1:
                transaction.rollback()
                raise SystemError("row affected are weird")
            
            transaction.commit()

    except Exception as err:
        transaction.rollback()
        return JsonResponse({"Error_Message": "failed to perform transaction, Something went wrong", "Dev_Message": err}, status=500)

    return JsonResponse({"Message": "Transaction complete", "flag": "1"}, status=200)


@require_http_methods(["GET", "OPTIONS"])
@Cookie_validation_middleware
def retrieve_item_info(request):
    try:
        retireve_item = Store_item.objects.all()
        item_json_format = []
        for i in retireve_item:
            item_json_format.append(i.tojson())
        return JsonResponse({"item_data": item_json_format})
    except Exception as err:
        return JsonResponse({"Error_Message": "something went wrong", "Dev_Message": err})

