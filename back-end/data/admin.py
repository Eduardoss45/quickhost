from django.contrib import admin
from .models import UserAccount, PropertyListing, BankDetails, Booking, FavoriteProperty


@admin.register(UserAccount)
class UserAccountAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "created_at")
    search_fields = ("username", "email")


@admin.register(PropertyListing)
class PropertyListingAdmin(admin.ModelAdmin):
    list_display = ("title", "price_per_night", "creator", "is_active", "created_at")
    search_fields = ("title", "creator__username")
    list_filter = ("is_active", "creator")  # Adiciona filtros para a interface de admin

    # Opcional: permite edição inline para adicionar informações relacionadas, se necessário
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related(
            "creator"
        )  # Melhora o desempenho ao acessar dados do criador

    # Mostra a representação do modelo na lista de propriedades
    def creator_username(self, obj):
        return obj.creator.username

    creator_username.short_description = "Criador"


@admin.register(BankDetails)
class BankDetailsAdmin(admin.ModelAdmin):
    list_display = ("account_holder", "bank_name")
    search_fields = ("account_holder", "bank_name")


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("user", "accommodation", "check_in_date", "check_out_date")
    search_fields = ("user__username", "accommodation__title")


@admin.register(FavoriteProperty)
class FavoritePropertyAdmin(admin.ModelAdmin):
    list_display = ("user", "accommodation")
    search_fields = ("user__username", "accommodation__title")
