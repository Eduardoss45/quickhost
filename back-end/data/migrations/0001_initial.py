# Generated by Django 5.1.1 on 2024-10-03 02:56

import data.models
import django.core.validators
import django.db.models.deletion
import django.utils.timezone
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='BankAccount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bank_name', models.CharField(max_length=255)),
                ('account_holder', models.CharField(max_length=255)),
                ('account_number', models.CharField(max_length=50)),
                ('agency_code', models.CharField(max_length=50)),
                ('account_type', models.CharField(max_length=50)),
                ('cpf', models.CharField(max_length=11)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('id_user', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('birth_date', models.DateField(blank=True, null=True)),
                ('phone_number', models.CharField(blank=True, max_length=20, null=True)),
                ('username', models.CharField(max_length=150, unique=True)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('social_name', models.CharField(blank=True, max_length=255, null=True)),
                ('profile_picture', models.ImageField(blank=True, null=True, upload_to=data.models.User.get_upload_to_profile_picture)),
                ('emergency_contact', models.CharField(blank=True, max_length=150, null=True)),
                ('registered_accommodations', models.TextField(blank=True, default='[]')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Accommodation',
            fields=[
                ('id_accommodation', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('property_name', models.CharField(blank=True, max_length=255)),
                ('main_cover', models.CharField(blank=True, max_length=255, null=True)),
                ('state', models.BooleanField(default=True)),
                ('internal_images', models.FileField(blank=True, null=True, upload_to='internal_images/')),
                ('category', models.CharField(choices=[('inn', 'Inn'), ('chalet', 'Chalet'), ('apartment', 'Apartment'), ('home', 'Home'), ('room', 'Room')], default='inn', max_length=50)),
                ('rooms', models.IntegerField(default=1, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(20)])),
                ('beds', models.IntegerField(default=1, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(20)])),
                ('bathroom', models.IntegerField(default=1, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(20)])),
                ('accommodated_guests', models.IntegerField(default=1, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(20)])),
                ('type_of_space', models.CharField(choices=[('full_space', 'Full Space'), ('limited_space', 'Limited Space')], default='full_space', max_length=50)),
                ('address', models.CharField(default='Not informed', max_length=255)),
                ('city', models.CharField(default='Not informed', max_length=100)),
                ('neighborhood', models.CharField(default='Not informed', max_length=100)),
                ('cep', models.CharField(default='Not informed', max_length=10)),
                ('complement', models.CharField(blank=True, default='Not informed', max_length=255)),
                ('wifi', models.BooleanField(default=False)),
                ('tv', models.BooleanField(default=False)),
                ('kitchen', models.BooleanField(default=False)),
                ('washing_machine', models.BooleanField(default=False)),
                ('parking_included', models.BooleanField(default=False)),
                ('air_conditioning', models.BooleanField(default=False)),
                ('pool', models.BooleanField(default=False)),
                ('jacuzzi', models.BooleanField(default=False)),
                ('grill', models.BooleanField(default=False)),
                ('private_gym', models.BooleanField(default=False)),
                ('beach_access', models.BooleanField(default=False)),
                ('smoke_detector', models.BooleanField(default=False)),
                ('fire_extinguisher', models.BooleanField(default=False)),
                ('first_aid_kit', models.BooleanField(default=False)),
                ('outdoor_camera', models.BooleanField(default=False)),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('price', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('bank_account', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='data.bankaccount')),
            ],
        ),
    ]
