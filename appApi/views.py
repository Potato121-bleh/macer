from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpRequest


def test_middleware(view_func):
    def test_operation(request: HttpRequest):
        print("nice")
        print(request)
        return view_func(request)
    return test_operation


@test_middleware
def testHandler(request: HttpRequest):
    testdata = {
        "Message": "Test successfully"
    }
    return JsonResponse(testdata)