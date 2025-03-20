from django.utils import timezone
from django.http import HttpResponse, HttpRequest, JsonResponse
from django.db import connection, connections, transaction
from django.views.decorators.http import require_http_methods
from .middlewareViews import Cookie_validation_middleware
from keyboardApp.models import User_info, Transaction, Store_item, Discount_code, Reviews

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

    request_data = json.loads(request.body)
    jwt_payload = getattr(request, "user_info")

    sql_statement = "INSERT INTO keyboardApp_transaction (transaction_user_id, item_id, transaction_date) VALUES "

    # check whether the price is met the requirement

    # NOTE: This code below is trying to get the transaction price to do another validation based on item that been sent
    #       So it not accurate as we also have discount, by this we don't do total price from backend, we do it from frontend
    #       FOR ANOTHER SECURITY REASON: we can ask frontend to return discount code too if we worried of security risk
    #       Where backend can take that code to validate again with server to ensure the total price of user purchase are perfectly good enough for transaction
    transaction_price = request_data["item_price"]
    # transaction_price = 0
    # for i in request_data["item_data"]:
    #     transaction_price += i[1]

    try:
        user_balance_query = User_info.objects.raw("SELECT * FROM keyboardApp_user_info WHERE user_id=%s", [jwt_payload["user_id"]])
        user_balance = user_balance_query[0].user_balance
        print(user_balance)
        if user_balance < transaction_price:
            return JsonResponse({"Error_Message": "Insufficient balance"}, status=400)
        user_balance -= transaction_price
    except Exception as err:
        return JsonResponse({"Error_Message": "Something went wrong", "Dev_Message": err})

    # START BUILDING SQL STATEMENT

    print(request_data)
    for i in request_data["item_data"]:
        prep_str = "( " + str(jwt_payload["user_id"]) + " , " + str(i[0]) + " , %s ) ,"
        print(prep_str)
        sql_statement += prep_str
    sql_statement_arr = sql_statement.split(" ")
    print("BEFORE POP")
    print(sql_statement_arr)
    popped_val = sql_statement_arr.pop()
    print("PPPPPPPPPPPPPPPPPPP")
    print(sql_statement)
    print(popped_val)
    print(sql_statement_arr)
    sql_statement_format = " ".join(sql_statement_arr)
    print("It DONE")
    print(sql_statement_format)
    try:
        with connections["keyboardAppDB"].cursor() as db_cursor:
            transaction.set_autocommit(autocommit=False)

            db_cursor.execute(sql_statement_format, [timezone.now()] * len(request_data["item_data"]))
            print("ROW COUNT")
            print(db_cursor.rowcount)
            print(len(request_data["item_data"]))
            if db_cursor.rowcount != len(request_data["item_data"]):
                transaction.rollback()
                raise SystemError("row affected are weird")
            
            db_cursor.execute("UPDATE keyboardApp_user_info SET user_balance = %s WHERE user_id = %s", [user_balance, jwt_payload["user_id"]])
            if db_cursor.rowcount != 1:
                transaction.rollback()
                raise SystemError("row affected are weird")
            
            transaction.commit()

    except Exception as err:
        transaction.rollback()
        return JsonResponse({"Error_Message": "failed to perform transaction, Something went wrong", "Dev_Message": err}, status=500)

    return JsonResponse({"Message": "Transaction complete", "flag": "1"}, status=200)


@require_http_methods(["GET", "OPTIONS"])
def retrieve_item_info(request):
    try:
        retireve_item = Store_item.objects.all()
        item_json_format = []
        for i in retireve_item:
            item_json_format.append(i.tojson())
        return JsonResponse({"item_data": item_json_format})
    except Exception as err:
        return JsonResponse({"Error_Message": "something went wrong", "Dev_Message": err})


@require_http_methods(["POST", "OPTIONS"])
def retrieve_item_with_brand(request: HttpRequest):
    try:
        request_data = json.loads(request.body)
        data_list = []
        if not request_data["brandName"]:
            return JsonResponse({"Error_Message": "failed to query data, Please make sure you include brand name"}, status=400)
        queried_data = Store_item.objects.raw("SELECT * FROM keyboardApp_store_item WHERE item_brand = %s", [request_data["brandName"]])
        for queried_data_element in queried_data:
            data_list.append(queried_data_element.tojson())
        return JsonResponse({"item_data": data_list})
    except Exception as e:
        return JsonResponse({"Error_Message": "failed to query data, Please make sure you include brand name", "Dev_Message": e}, status=500)

@require_http_methods(["POST", "OPTIONS"])
@Cookie_validation_middleware  
def retrieve_discount(request: HttpRequest):
    try:
        req_body = json.loads(request.body)
        queried_discount = Discount_code.objects.raw("SELECT * FROM keyboardApp_discount_code WHERE code = %s", [req_body["discountCode"]])
        for queried_element in queried_discount:
            if queried_element.to_json():
                print(queried_element.to_json())
                if queried_element.is_valid():
                    return JsonResponse({"item_data": queried_element.to_json()})
                else:
                    raise Exception("discount coupon is invalid")
            else:
                raise Exception("failed to query discout from server")
        
    except Exception as e:
        return JsonResponse({"Error_Message": e})

def submit_review(request: HttpRequest):
    # we accept user id, selected item, review star, review text from frontend
    req_body = json.load(request.body)
    req_body["userId"]
    if req_body["userId"] or req_body["storeItemId"] or req_body["rating"] or req_body["reviewText"] == "" :
        return JsonResponse({"Error_Message": "failed to validate http request, Please make sure to submit all required field"}, status=400)
    try:
        with connections["keyboardAppDB"].cursor() as con:
            transaction.set_autocommit(False)
            con.execute("INSERT INTO keyboardApp_reviews (user_id_id, store_item_id_id, rating, review_text) VALUES (%s, %s, %s, %s)", 
                        [req_body["userId"], req_body["storeItemId"], req_body["rating"], req_body["reviewText"]])
            if con.rowcount != 1:
                transaction.rollback()
                raise Exception("unexpected row affected")
            transaction.commit()
    except Exception as e:
        transaction.rollback()
        err_resp = f"failed to submit the review, Please try again later {str(e)}"
        return JsonResponse({"Error_Message": err_resp}, status=500)
    finally:
        transaction.set_autocommit(True)
    return JsonResponse({"Message": "review has submitted"}, status=200)


    # review_id = models.AutoField(primary_key=True)
    # user_id = models.ForeignKey("User_info", on_delete=models.CASCADE, related_name="user_review")
    # store_item_id = models.ForeignKey("Store_item", on_delete=models.CASCADE, related_name="user_review_item")
    # rating = models.IntegerField()
    # review_text = models.TextField()
    # created_at = models.DateTimeField(auto_now_add=True)


@require_http_methods(["GET", "OPTIONS"])
@Cookie_validation_middleware 
def retrieve_user_balance(request: HttpRequest):
    jwt_payload = getattr(request, "user_info")
    try:
        with connections["keyboardAppDB"].cursor() as con:
            
            con.execute("SELECT user_balance FROM keyboardApp_user_info WHERE user_id = %s", [jwt_payload["user_id"]])
            user_balance = con.fetchone()
            if user_balance == None:
                raise Exception("no queried data found")
            return JsonResponse({"item_data": user_balance}, status=200)
    except Exception as e:
        return JsonResponse({"Error_Message": f"failed to retrieve user_balance: ERROR ({str(e)})"}, status=500)


#  jwtPayload = {
#             "user_id": queried_user.user_id,
#             "user_name": queried_user.user_name,
#             "user_nickname": queried_user.user_nickname,
#             "user_balance": float(queried_user.user_balance),
#             "exp": (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)).timestamp()
#         }