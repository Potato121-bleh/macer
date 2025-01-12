import json
from django.http import HttpRequest, JsonResponse
from keyboardApp.models import User_info as keyboardApp_user_info


# 
def Crediential_validate_middleware(view_func):
    def test_operation(request: HttpRequest):
        try:
            requestData = json.loads(request.body)
        except Exception as err:
            print(err)
        if requestData["username"] and requestData["password"]:
            # perform database query
            queried_user = keyboardApp_user_info.objects.filter(user_name=requestData["username"])
            if queried_user:
                print("username: " + queried_user[0].user_name)
                print("password: " + queried_user[0].user_password)
                #validate the user password
                if requestData["password"] != queried_user[0].user_password:
                    return JsonResponse({"Error Message": "something went wrong, Username / password is incorrect"}, status=401)
                request.user_info = queried_user[0]
            else:
                return JsonResponse({"Error Message": "user not found"}, status=404)
        else:
            return JsonResponse({"Error Message": "Please provide info to proceed"}, status=400)

        return view_func(request)
    return test_operation


def Crediential_cookie_validation_middleware(view_func):
    
    def validate_the_cookie(request):
        print("Hi")
        
    return validate_the_cookie