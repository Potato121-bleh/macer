from django.db import models

# Create your models here.
class user_info(models.model):
    user_id= models.AutoField(primary_key=True)
    user_name= models.CharField(max_length=50)
    user_age = models.IntegerField()
    date_time= models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"user_id: {self.user_id}, user_name: {self.user_name}, user_age: {self.user_age}, date_time: {self.date_time}"