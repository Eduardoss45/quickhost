from django.db.models import UniqueConstraint, Avg
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from uuid import uuid4
from .validators import (
    validate_room_count,
    validate_bed_count,
    validate_bathroom_count,
    validate_guest_capacity,
)
from .converters import (
    update_registered_accommodations,
    update_registered_accommodations_bookings,
    update_registered_bookings,
    update_registered_favorite_property,
    update_registered_reviews,
    update_registered_user_bookings,
)


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
    cpf = models.CharField(max_length=11, null=True)
    registered_accommodations = models.JSONField(default=list, blank=True)
    registered_reviews = models.JSONField(default=list, blank=True)
    registered_bookings = models.JSONField(default=list, blank=True)
    registered_accommodations_bookings = models.JSONField(default=list, blank=True)
    registered_favorite_property = models.JSONField(default=list, blank=True)
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
    consecutive_days_limit = models.IntegerField(
        blank=True, null=True, help_text="Número de dias consecutivos permitido."
    )
    main_cover_image = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    internal_images = models.JSONField(blank=True, null=True, default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    average_rating = models.DecimalField(
        max_digits=3, decimal_places=2, default=0.00, blank=True
    )
    registered_user_bookings = models.JSONField(default=list, blank=True)
    registered_bookings = models.JSONField(default=list, blank=True)
    discount = models.BooleanField(default=False)
    cleaning_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    final_price = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00, blank=True, null=True
    )
    CATEGORY_CHOICES = [
        ("inn", _("Inn")),
        ("chalet", _("Chalet")),
        ("apartment", _("Apartment")),
        ("home", _("Home")),
        ("room", _("Room")),
    ]
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="inn")

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

    SPACE_TYPE_CHOICES = [
        ("full_space", _("Full Space")),
        ("limited_space", _("Limited Space")),
    ]
    space_type = models.CharField(
        max_length=50, choices=SPACE_TYPE_CHOICES, default="full_space"
    )

    address = models.CharField(max_length=255, default="Not informed")
    city = models.CharField(max_length=100, default="Not informed")
    neighborhood = models.CharField(max_length=100, default="Not informed")
    postal_code = models.CharField(max_length=10, default="Not informed")
    uf = models.CharField(max_length=10, default="Not informed", blank=True)
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

    bank_account = models.OneToOneField(
        BankDetails, on_delete=models.CASCADE, null=True, blank=True
    )

    def __str__(self):
        return self.title or _("Accommodation without title")

    def calculate_final_price(self):
        """Calcula o preço final da acomodação com base no preço por noite e a taxa de limpeza."""
        total_cost = self.price_per_night + self.cleaning_fee
        return total_cost

    def save(self, *args, **kwargs):
        validate_room_count(self.room_count)
        validate_bed_count(self.bed_count)
        validate_bathroom_count(self.bathroom_count)
        validate_guest_capacity(self.guest_capacity)
        self.final_price = self.calculate_final_price()

        if self.main_cover_image and self.main_cover_image not in self.internal_images:
            raise ValidationError(
                _("The cover image must be one of the internal images.")
            )
        super().save(*args, **kwargs)


# ---------------------
# Modelo de Reserva
# ---------------------
class Booking(models.Model):
    id_booking = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    user_booking = models.ForeignKey(
        "UserAccount",
        on_delete=models.CASCADE,
        related_name="user_bookings",  # Nome customizado para acessar as reservas do usuário
    )
    accommodation = models.ForeignKey(
        "PropertyListing",
        on_delete=models.CASCADE,
        related_name="accommodation_bookings",  # Nome customizado para acessar as reservas da acomodação
    )
    check_in_date = models.DateField()
    check_out_date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return (
            f"Reserva de {self.user_booking.username} para {self.accommodation.title}"
        )


@receiver(post_save, sender=Booking)
def add_to_registered_bookings(sender, instance, created, **kwargs):
    """
    Adiciona a reserva ao campo 'registered_bookings e registered_accommodations_bookings' do usuário quando criada.
    """
    if created:
        update_registered_bookings(instance.user_booking, instance.accommodation)
        update_registered_user_bookings(instance.user_booking, instance.id_booking)
        update_registered_accommodations_bookings(
            instance.user_booking, instance.id_accommodation
        )


# ---------------------
# Modelo de Favoritos
# ---------------------
class FavoriteProperty(models.Model):
    id_favorite_property = models.UUIDField(
        primary_key=True, default=uuid4, editable=False
    )
    user_favorite_property = models.ForeignKey("UserAccount", on_delete=models.CASCADE)
    accommodation = models.ForeignKey("PropertyListing", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user_favorite_property", "accommodation"],
                name="unique_user_accommodation_favorite",
            )
        ]

    def __str__(self):
        return f"{self.user_favorite_property.username} - {self.accommodation.title}"


@receiver(post_save, sender=FavoriteProperty)
def add_to_registered_favorite_property(sender, instance, created, **kwargs):
    """
    Adiciona a propriedade favorita ao campo 'registered_favorite_property' do usuário.
    """
    if created:
        update_registered_favorite_property(
            instance.user_favorite_property, instance.id_favorite_property
        )


# ---------------------
# Modelo de Avaliações
# ---------------------
class Review(models.Model):
    id_review = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    accommodation = models.ForeignKey(
        "PropertyListing", on_delete=models.CASCADE, related_name="reviews"
    )
    user_comment = models.ForeignKey(
        "UserAccount", on_delete=models.CASCADE, related_name="reviews"
    )
    rating = models.IntegerField(null=False)
    comment = models.TextField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review {self.id_review} for accommodation {self.accommodation.id_accommodation}"


@receiver(post_save, sender=Review)
def add_to_registered_reviews(sender, instance, created, **kwargs):
    """
    Adiciona a avaliação ao campo 'registered_reviews' do usuário e atualiza a média de avaliações.
    """
    if created:
        update_registered_reviews(instance.user_comment, instance.id_review)
        instance.accommodation.update_average_rating()
