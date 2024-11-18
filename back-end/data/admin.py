from django.contrib import admin
from .models import (
    BankDetails,
    UserAccount,
    PropertyListing,
    Booking,
    FavoriteProperty,
    Review,
)


@admin.register(BankDetails)
class BankDetailsAdmin(admin.ModelAdmin):
    list_display = ("bank_name", "account_holder", "account_type", "cpf", "created_at")
    search_fields = ("bank_name", "account_holder", "cpf")
    list_filter = ("account_type", "created_at")


@admin.register(UserAccount)
class UserAccountAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "cpf", "created_at")
    search_fields = ("username", "email", "cpf")
    list_filter = ("created_at",)


@admin.register(PropertyListing)
class PropertyListingAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "price_per_night",
        "creator_username",
        "is_active",
        "created_at",
    )
    search_fields = ("title", "creator__username", "category")
    list_filter = ("category", "is_active", "created_at")

    def creator_username(self, obj):
        return obj.creator.username

    creator_username.short_description = "Criador"


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "accommodation",
        "check_in_date",
        "check_out_date",
        "total_price",
        "is_active",
    )
    search_fields = ("user__username", "accommodation__title")
    list_filter = ("is_active", "check_in_date", "check_out_date", "created_at")


@admin.register(FavoriteProperty)
class FavoritePropertyAdmin(admin.ModelAdmin):
    list_display = ("user", "accommodation", "created_at")
    search_fields = ("user__username", "accommodation__title")
    list_filter = ("created_at",)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = (
        "id_review",
        "accommodation",
        "user_comment",
        "rating",
        "created_at",
    )
    search_fields = ("accommodation__title", "user_comment__username", "comment")
    list_filter = ("rating", "created_at")

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related("accommodation", "user_comment")
