from django.contrib import admin
from .models import Item_storage, Item_storage_car, User_info

# If you want data in admin to display as datagrid you can define your own class and create
# list_display

# class dataGrid(admin.ModelAdmin):
#     list_display = ('id', 'name', 'price')

# Register your models here.
admin.site.register(Item_storage)
admin.site.register(User_info)
