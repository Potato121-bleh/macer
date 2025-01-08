# Generated by Django 5.1.4 on 2025-01-07 05:04

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Item_storage',
            fields=[
                ('item_id', models.AutoField(primary_key=True, serialize=False)),
                ('item_name', models.CharField(max_length=50)),
                ('item_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('item_img', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='User_info',
            fields=[
                ('user_id', models.AutoField(primary_key=True, serialize=False)),
                ('user_name', models.CharField(max_length=50)),
                ('user_age', models.IntegerField()),
                ('date_time', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]