# Generated by Django 5.1.1 on 2024-10-28 02:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data', '0003_remove_useraccount_verification_token_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='propertylisting',
            name='amenities',
        ),
        migrations.AddField(
            model_name='propertylisting',
            name='air_conditioning',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='propertylisting',
            name='beach_access',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='propertylisting',
            name='fire_extinguisher',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='propertylisting',
            name='first_aid_kit',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='propertylisting',
            name='grill',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='propertylisting',
            name='jacuzzi',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='propertylisting',
            name='kitchen',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='propertylisting',
            name='outdoor_camera',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='propertylisting',
            name='parking_included',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='propertylisting',
            name='pool',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='propertylisting',
            name='private_gym',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='propertylisting',
            name='smoke_detector',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='propertylisting',
            name='tv',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='propertylisting',
            name='washing_machine',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='propertylisting',
            name='wifi',
            field=models.BooleanField(default=False),
        ),
    ]
