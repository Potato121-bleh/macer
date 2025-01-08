from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpRequest
from django.views.decorators.http import require_http_methods
import json



def test_middleware(view_func):
    def test_operation(request: HttpRequest):
        print("nice")
        try:
            formatted_data = json.loads(request.body)
        except Exception as err:
            print(err)
        print(formatted_data)
        return view_func(request)
    return test_operation


@require_http_methods(["POST", "OPTIONS"])
@test_middleware
def testHandler(request: HttpRequest):
    testdata = {
        "Message": "Test successfully"
    }
    return JsonResponse(testdata)