# Generated by Django 5.1.1 on 2024-11-01 12:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data', '0004_remove_propertylisting_amenities_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='useraccount',
            name='registered_accommodations',
            field=models.JSONField(blank=True, default=list),
        ),
    ]