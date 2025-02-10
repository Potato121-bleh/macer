# Generated by Django 5.1.4 on 2025-02-10 02:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('keyboardApp', '0011_alter_store_item_item_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user_info',
            name='user_balance',
            field=models.DecimalField(decimal_places=2, max_digits=6),
        ),
        migrations.AlterField(
            model_name='user_info',
            name='user_name',
            field=models.CharField(max_length=12, unique=True),
        ),
        migrations.AlterField(
            model_name='user_info',
            name='user_nickname',
            field=models.CharField(max_length=12),
        ),
    ]
