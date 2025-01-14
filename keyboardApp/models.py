from django.db import models

# Create your models here.
class User_info(models.Model):
    user_id         = models.AutoField(primary_key=True)
    user_name       = models.CharField(max_length=50, unique=True)
    user_nickname   = models.CharField(max_length=50)
    user_password   = models.TextField()
    user_balance    = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"User_info(user_id: {self.user_id}, user_name: {self.user_name}, user_nickname: {self.user_nickname}, user_password: {self.user_password}, user_balance: {self.user_balance})"


class Store_item(models.Model):
    item_id     = models.AutoField(primary_key=True)
    item_name   = models.CharField(max_length=50, default="N/A")
    item_description = models.CharField(max_length=50, default="N/A")
    item_key_color = models.CharField(max_length=50, default="N/A")
    item_price  = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Store_item(item_id: {self.item_id}, item_name: {self.item_name}, item_description: {self.item_description}, item_key_color: {self.item_key_color}, item_price: {self.item_price})"
    
    def tojson(self):
        return {
            "item_id": int(self.item_id), 
            "item_name": str(self.item_name), 
            "item_description": str(self.item_description), 
            "item_key_color": str(self.item_key_color), 
            "item_price": float(self.item_price)
        }


class Transaction(models.Model):
    transaction_id         = models.AutoField(primary_key=True)
    transaction_user_id    = models.ForeignKey("User_info", on_delete=models.CASCADE, related_name="user_transaction" )
    item_id                = models.ForeignKey("Store_item", on_delete=models.CASCADE, related_name="bought_by")


    def __str__(self):
        return f"Transaction(transaction_id: {self.transaction_id}, transaction_user_id: {self.transaction_user_id}, item_id: {self.item_id}, price: {self.price})"


