from django.db import models



select_provinces=(
        ('KT','Kampong Thom'),
        ('Kep','Kep'),
        ('Kratie','Kratie'),
        ('SR','Svay Rieng'),
        ('Pursat','Pursat'),
        ('Takeo','Takeo'),
        ('Siem Reap','Siem Reap'),
        ('KK','Koh Kong'),
        ('KS','Kampong Speu'),
        ('PP','Phnom Penh'),
        ('BB','Battambang'),
        ('RK','Ratanakiri'),
        ('OM','Oddar Meanchey'),
        ('SH','Sihanoukville'),
        ('Kampot','Kampot'),
        ('Kandal','Kandal'),
        ('PV','Prey Veng'),
        ('MK','Mondulkiri'),
        ('ST','Stung Treng'),
        ('PL','Palin'),
    )
select_gender = (
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    )
select_hobbys = (
        ('Swimming', 'Swimming'),
        ('Reading', 'Reading'),
        ('Bike', 'Bike'),
        ('Others', 'Others'),
    )

select_language = (
    ("English", "English"),
    ("Khmer", "Khmer"),
)


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
    


class Item_storage_car(models.Model):
    item_id     = models.AutoField(primary_key=True)
    item_name   = models.CharField(max_length=50)
    item_img    = models.CharField(max_length=5000)



# class Staff(models.Model):
#     name=models.CharField(max_length=255)
#     # Sex=models.CharField(max_length=8, choices=select_gender)
#     date_of_birth=models.DateTimeField()
#     place_of_birth=models.CharField(max_length=255, choices=select_provinces)
#     language = models.CharField(max_length=100, choices=select_language)
#     hobby=models.CharField(max_length=100,choices=select_hobbys)
#     salary = models.IntegerField()
#     # photo=models.ImageField(null=True, blank=True, upload_to ='images/')

class Branch(models.Model):
    branchNo = models.CharField(primary_key=True, max_length=50, default="Unknown_No")
    branchAddress = models.CharField(max_length=150, default="N/A")
    telNo = models.CharField(max_length=50, default="N/A")

class Staff(models.Model):
    staffNo=models.CharField(primary_key=True, max_length=50, default="anonymous_No")
    name=models.CharField(max_length=100, default="anonymous")
    position=models.CharField(max_length=50, default="N/A")
    salary = models.IntegerField()
    branchNo = models.ForeignKey("Branch", on_delete=models.CASCADE, related_name="staff_branch", default="N/A")
    # photo=models.ImageField(null=True, blank=True, upload_to ='images/')


class Order(models.Model):
    product_id = models.AutoField(primary_key=True)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

class Product(models.Model):
    product_id = models.IntegerField(primary_key=True)
    description = models.ForeignKey("Item_storage", on_delete=models.CASCADE, related_name="product_item")

class supplier(models.Model):
    sup_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=50)
    address = models.CharField(max_length=200)
    email = models.CharField(max_length=200)

class customer(models.Model):
    customer_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=50)

