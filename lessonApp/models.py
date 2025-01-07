from django.db import models

# Create your models here.
class User_info(models.Model):
    user_id     = models.AutoField(primary_key=True)
    user_name   = models.CharField(max_length=50)
    user_age    = models.IntegerField()
    date_time   = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"User_info(user_id: {self.user_id}, user_name: {self.user_name}, user_age: {self.user_age}, date_time: {self.date_time})"
    

class Item_storage(models.Model):
    item_id     = models.AutoField(primary_key=True)
    item_name   = models.CharField(max_length=50)
    item_price  = models.DecimalField(max_digits=10, decimal_places=2)
    item_img    = models.TextField()

    def __str__(self):
        return f"Item_storage(item_id: {self.item_id}, item_name: {self.item_name}, item_price: {self.item_price}, item_img: {self.item_img})"
