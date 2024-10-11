from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.contrib.postgres.fields import JSONField
from django.db import models
from uuid import uuid4
import json


def upload_image(instance, filename, image_type):
    if image_type == "profile_picture":
        return f"profile_pictures/{instance.id_user}/{filename}"
    elif image_type == "internal_image":
        return f"internal_images/{instance.id_accommodation}/{filename}"
    else:
        raise ValueError("Tipo de imagem não suportado")


class BankAccount(models.Model):
    bank_name = models.CharField(max_length=255)
    account_holder = models.CharField(max_length=255)
    account_number = models.CharField(max_length=50)
    agency_code = models.CharField(max_length=50)
    account_type = models.CharField(max_length=50)
    cpf = models.CharField(max_length=11)

    def __str__(self):
        return f"{self.bank_name} - {self.account_holder}"


class Accommodation(models.Model):
    id_accommodation = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    property_name = models.CharField(max_length=255, blank=True)
    main_cover = models.CharField(max_length=255, blank=True, null=True)
    state = models.BooleanField(default=True)
    internal_images = models.JSONField(blank=True, null=True, default=list)

    CATEGORY_CHOICES = [
        ("inn", "Inn"),
        ("chalet", "Chalet"),
        ("apartment", "Apartment"),
        ("home", "Home"),
        ("room", "Room"),
    ]
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="inn")

    rooms = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(20)], default=1
    )
    beds = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(20)], default=1
    )
    bathroom = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(20)], default=1
    )
    accommodated_guests = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(20)], default=1
    )

    SPACE_TYPE_CHOICES = [
        ("full_space", "Full Space"),
        ("limited_space", "Limited Space"),
    ]
    type_of_space = models.CharField(
        max_length=50, choices=SPACE_TYPE_CHOICES, default="full_space"
    )

    address = models.CharField(max_length=255, default="Not informed")
    city = models.CharField(max_length=100, default="Not informed")
    neighborhood = models.CharField(max_length=100, default="Not informed")
    cep = models.CharField(max_length=10, default="Not informed")
    complement = models.CharField(max_length=255, default="Not informed", blank=True)

    wifi = models.BooleanField(default=False)
    tv = models.BooleanField(default=False)
    kitchen = models.BooleanField(default=False)
    washing_machine = models.BooleanField(default=False)
    parking_included = models.BooleanField(default=False)
    air_conditioning = models.BooleanField(default=False)
    pool = models.BooleanField(default=False)
    jacuzzi = models.BooleanField(default=False)
    grill = models.BooleanField(default=False)
    private_gym = models.BooleanField(default=False)
    beach_access = models.BooleanField(default=False)

    smoke_detector = models.BooleanField(default=False)
    fire_extinguisher = models.BooleanField(default=False)
    first_aid_kit = models.BooleanField(default=False)
    outdoor_camera = models.BooleanField(default=False)

    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    bank_account = models.OneToOneField(
        BankAccount, on_delete=models.CASCADE, null=True, blank=True
    )

    def save(self, *args, **kwargs):
        if self.rooms <= 0 or self.rooms >= 21:
            self.rooms = 1
        if self.beds <= 0 or self.beds >= 21:
            self.beds = 1
        if self.bathroom <= 0 or self.bathroom >= 21:
            self.bathroom = 1
        if self.accommodated_guests <= 0 or self.accommodated_guests >= 21:
            self.accommodated_guests = 1
        if self.main_cover and self.main_cover not in json.loads(self.internal_images):
            raise ValueError(
                "A imagem da capa deve ser uma das cinco imagens internas."
            )
        super().save(*args, **kwargs)


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Defina o email")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    id_user = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    birth_date = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    social_name = models.CharField(max_length=255, blank=True, null=True)

    def get_upload_to_profile_picture(self, filename):
        return upload_image(self, filename, "profile_picture")

    profile_picture = models.ImageField(
        upload_to=get_upload_to_profile_picture,
        blank=True,
        null=True,
    )

    emergency_contact = models.CharField(max_length=150, null=True, blank=True)
    registered_accommodations = models.TextField(default="[]", blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()
