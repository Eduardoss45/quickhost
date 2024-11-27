# Generated by Django 5.1.3 on 2024-11-26 10:16

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='booking',
            name='accommodation',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='accommodation_bookings', to='data.propertylisting'),
        ),
        migrations.AlterField(
            model_name='booking',
            name='user_booking',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_bookings', to=settings.AUTH_USER_MODEL),
        ),
    ]