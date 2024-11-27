# Generated by Django 5.1.3 on 2024-11-27 19:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data', '0002_rename_registered_users_propertylisting_registered_user_bookings'),
    ]

    operations = [
        migrations.RenameField(
            model_name='propertylisting',
            old_name='registered_user_bookings',
            new_name='registered_bookings',
        ),
        migrations.AlterField(
            model_name='propertylisting',
            name='registered_accommodation_bookings',
            field=models.ManyToManyField(blank=True, to='data.propertylisting'),
        ),
    ]