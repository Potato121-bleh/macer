# Generated by Django 5.1.4 on 2025-01-13 01:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lessonApp', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item_storage',
            name='item_img',
            field=models.CharField(max_length=5000),
        ),
    ]
