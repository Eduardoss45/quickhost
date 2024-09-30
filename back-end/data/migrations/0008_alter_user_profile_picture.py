# Generated by Django 5.1.1 on 2024-09-29 18:53

import data.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data', '0007_rename_accommodations_accommodation_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='profile_picture',
            field=models.ImageField(blank=True, null=True, upload_to=data.models.User.get_upload_to_profile_picture),
        ),
    ]
