from django.contrib import admin
from keyboardApp.models import User_info, Transaction, Store_item

# Register your models here.
admin.site.register(User_info)
admin.site.register(Transaction)
admin.site.register(Store_item)
