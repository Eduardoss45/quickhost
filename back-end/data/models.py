# models.py
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from uuid import uuid4
import json
from .validators import (
    validate_room_count,
    validate_bed_count,
    validate_bathroom_count,
    validate_guest_capacity,
)
from .converters import update_registered_accommodations


# ---------------------
# Modelos de Conta Bancária
# ---------------------
class BankDetails(models.Model):
    bank_name = models.CharField(max_length=255)
    account_holder = models.CharField(max_length=255)
    account_number = models.CharField(max_length=50)
    agency_code = models.CharField(max_length=50)
    account_type = models.CharField(max_length=50)
    cpf = models.CharField(max_length=11)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.bank_name} - {self.account_holder}"


# ---------------------
# Gerenciador de Usuário Personalizado
# ---------------------
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


# ---------------------
# Modelo de Conta de Usuário
# ---------------------
class UserAccount(AbstractUser):
    id_user = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    birth_date = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    social_name = models.CharField(max_length=255, blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", blank=True, null=True
    )
    emergency_contact = models.CharField(max_length=150, null=True, blank=True)
    registered_accommodations = models.TextField(default="[]", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    objects = CustomUserManager()

    def __str__(self):
        return f"{self.username} ({self.email})"


# ---------------------
# Modelo de Anúncio de Propriedade
# ---------------------
class PropertyListing(models.Model):
    id_accommodation = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    creator = models.ForeignKey(
        UserAccount, on_delete=models.CASCADE, related_name="accommodations"
    )
    main_cover_image = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    internal_images = models.JSONField(blank=True, null=True, default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    # Escolhas de categorias de propriedades
    CATEGORY_CHOICES = [
        ("inn", "Inn"),
        ("chalet", "Chalet"),
        ("apartment", "Apartment"),
        ("home", "Home"),
        ("room", "Room"),
    ]
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="inn")

    # Contadores de características da propriedade
    room_count = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(20)], default=1
    )
    bed_count = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(20)], default=1
    )
    bathroom_count = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(20)], default=1
    )
    guest_capacity = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(20)], default=1
    )

    # Tipo de espaço da propriedade
    SPACE_TYPE_CHOICES = [
        ("full_space", "Full Space"),
        ("limited_space", "Limited Space"),
    ]
    space_type = models.CharField(
        max_length=50, choices=SPACE_TYPE_CHOICES, default="full_space"
    )

    # Endereço da propriedade
    address = models.CharField(max_length=255, default="Not informed")
    city = models.CharField(max_length=100, default="Not informed")
    neighborhood = models.CharField(max_length=100, default="Not informed")
    postal_code = models.CharField(max_length=10, default="Not informed")
    complement = models.CharField(max_length=255, default="Not informed", blank=True)

    # Amenidades da propriedade armazenadas em um campo JSON
    amenities = models.JSONField(default=dict, blank=True)

    title = models.CharField(max_length=255)  # Título do anúncio
    description = models.TextField()  # Descrição da propriedade
    price_per_night = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00
    )  # Preço por noite

    # Relacionamento com detalhes bancários
    bank_account = models.OneToOneField(
        BankDetails, on_delete=models.CASCADE, null=True, blank=True
    )

    def __str__(self):
        return self.title or "Acomodação sem título"

    def save(self, *args, **kwargs):
        # Validações durante o salvamento
        validate_room_count(self.room_count)
        validate_bed_count(self.bed_count)
        validate_bathroom_count(self.bathroom_count)
        validate_guest_capacity(self.guest_capacity)

        if self.main_cover_image and self.main_cover_image not in json.loads(
            self.internal_images
        ):
            raise ValueError(
                "A imagem da capa deve ser uma das cinco imagens internas."
            )

        if self.pk is None:  # Apenas se for uma nova acomodação
            update_registered_accommodations(self.creator, self.id_accommodation)

        super().save(*args, **kwargs)


# ---------------------
# Modelo de Reserva
# ---------------------
class Booking(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    accommodation = models.ForeignKey(PropertyListing, on_delete=models.CASCADE)
    check_in_date = models.DateField()
    check_out_date = models.DateField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reserva de {self.user.username} para {self.accommodation.title}"


# ---------------------
# Modelo de Favoritos
# ---------------------
class FavoriteProperty(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    accommodation = models.ForeignKey(PropertyListing, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "accommodation")

    def __str__(self):
        return f"{self.user.username} - {self.accommodation.title}"
