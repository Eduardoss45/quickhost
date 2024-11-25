from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.files.uploadedfile import TemporaryUploadedFile
from django.core.exceptions import ObjectDoesNotExist
from django.core.files.storage import default_storage
from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.db import transaction
from urllib.parse import urlparse
from django.urls import reverse
from django.conf import settings
from datetime import datetime, date
from decimal import Decimal
from data import models
import os
import uuid
import logging


from .validation import (
    validate_birth_date,
    validate_phone_number,
    validate_username,
    validate_email,
    validate_social_name,
    validate_profile_picture,
    validate_cpf,
    validate_password,
    validate_room_count,
    validate_bed_count,
    validate_bathroom_count,
    validate_guest_capacity,
    validate_price_per_night,
    validate_main_cover_image,
    validate_space_type,
    validate_address,
    validate_city,
    validate_category,
    validate_neighborhood,
    validate_postal_code,
    validate_wifi,
    validate_tv,
    validate_kitchen,
    validate_washing_machine,
    validate_parking_included,
    validate_air_conditioning,
    validate_pool,
    validate_jacuzzi,
    validate_grill,
    validate_private_gym,
    validate_beach_access,
    validate_smoke_detector,
    validate_fire_extinguisher,
    validate_first_aid_kit,
    validate_outdoor_camera,
    validate_rating,
    validate_comment,
    validate_check_in_date,
    validate_check_out_date,
    validate_total_price,
    validate_is_active,
    validate_discount,
)


User = get_user_model()
logger = logging.getLogger("my_logger")


def generate_new_filename(original_filename):
    """Gera um novo nome de arquivo para a imagem de perfil."""
    import uuid
    import os

    extension = os.path.splitext(original_filename)[1]
    new_filename = f"{uuid.uuid4().hex}{extension}"
    return new_filename


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer para criação de novos usuários."""

    class Meta:
        model = models.UserAccount
        fields = [
            "birth_date",
            "username",
            "email",
            "cpf",
            "password",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, attrs):
        """Valida os campos do usuário."""
        errors = {}

        birth_date_error = validate_birth_date(attrs.get("birth_date"))
        if birth_date_error:
            errors["birth_date"] = birth_date_error

        username_error = validate_username(attrs.get("username"))
        if username_error:
            errors["username"] = username_error

        email_error = validate_email(attrs.get("email"))
        if email_error:
            errors["email"] = email_error

        cpf_error = validate_cpf(attrs.get("cpf"))
        if cpf_error:
            errors["cpf"] = cpf_error

        password_error = validate_password(attrs.get("password"))
        if password_error:
            errors["password"] = password_error

        if errors:
            logger.error(f"Erros de validação encontrados: {errors}")
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        """Cria e salva um novo usuário no banco de dados."""
        logger.debug("Iniciando a criação do usuário.")

        password = validated_data.pop("password", None)
        profile_picture = validated_data.pop("profile_picture", None)

        user = User.objects.create_user(**validated_data)
        user.is_active = True
        logger.info(
            f"Usuário '{user.username}' criado com sucesso. UUID: {user.id_user}"
        )

        if profile_picture:
            new_filename = generate_new_filename(profile_picture.name)
            user.profile_picture.save(
                os.path.join(str(user.id_user), new_filename),
                profile_picture,
                save=True,
            )

        if password:
            user.set_password(password)
            user.save()

        logger.debug(f"Usuário criado: {user}")
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer para atualização de dados do usuário."""

    class Meta:
        model = models.UserAccount
        fields = [
            "id_user",
            "birth_date",
            "phone_number",
            "username",
            "email",
            "social_name",
            "profile_picture",
            "cpf",
            "registered_accommodations",
            "registered_bookings",
            "created_at",
            "password",
        ]
        extra_kwargs = {field: {"required": False} for field in fields}

    def validate(self, attrs):
        """Valida os campos do usuário para atualização."""
        errors = {}

        if "username" in attrs:
            username_error = validate_username(attrs.get("username"))
            if username_error:
                errors["username"] = username_error

        if "phone_number" in attrs:
            phone_number_error = validate_phone_number(attrs.get("phone_number"))
            if phone_number_error:
                errors["phone_number"] = phone_number_error

        if "social_name" in attrs:
            social_name_error = validate_social_name(attrs.get("social_name"))
            if social_name_error:
                errors["social_name"] = social_name_error

        if "profile_picture" in attrs:
            profile_picture_error = validate_profile_picture(
                attrs.get("profile_picture")
            )
            if profile_picture_error:
                errors["profile_picture"] = profile_picture_error

        if "cpf" in attrs:
            cpf_error = validate_cpf(attrs.get("cpf"))
            if cpf_error:
                errors["cpf"] = cpf_error

        if errors:
            logger.error(f"Erros de validação na atualização: {errors}")
            raise serializers.ValidationError(errors)

        return attrs

    def update(self, instance, validated_data):
        """Atualiza os dados do usuário e retorna mensagem apropriada."""
        logger.debug(f"Iniciando a atualização do usuário: {instance.username}")

        fields_to_update = [
            "username",
            "cpf",
            "phone_number",
            "social_name",
            "password",
            "profile_picture",
        ]
        for field in fields_to_update:
            if field in validated_data:
                setattr(instance, field, validated_data[field])

        # Verificar e atualizar a imagem de perfil apenas se não for URL
        if "profile_picture" in validated_data:
            profile_picture = validated_data["profile_picture"]

            # Verificar se é uma URL
            if isinstance(profile_picture, str) and urlparse(profile_picture).scheme:
                # Caso seja uma URL, você pode ignorar a atualização ou fazer algo específico
                instance.profile_picture = profile_picture
            elif isinstance(
                profile_picture, TemporaryUploadedFile
            ):  # Caso seja um arquivo
                new_filename = generate_new_filename(profile_picture.name)
                instance.profile_picture.save(
                    os.path.join(str(instance.id_user), new_filename),
                    profile_picture,
                    save=True,
                )

        if "cpf" in validated_data:
            cpf = validated_data["cpf"]

        if "password" in validated_data:
            new_password = validated_data["password"]
            instance.set_password(new_password)

        # Tentativa de salvar a instância
        try:
            instance.save()
        except serializers.ValidationError as e:
            logger.error(f"Erro de validação: {e}")
            raise e
        except Exception as e:
            logger.error(f"Erro ao salvar usuário: {e}")
            raise serializers.ValidationError("Erro ao atualizar os dados do usuário.")

        logger.info(f"Usuário '{instance.username}' atualizado com sucesso.")

        return {
            "message": "Os dados do usuário foram alterados com sucesso.",
            "data": {
                "username": instance.username,
                "phone_number": instance.phone_number,
                "social_name": instance.social_name,
                "cpf": instance.cpf,
                "profile_picture": (
                    instance.profile_picture.url if instance.profile_picture else None
                ),
                "password": instance.password,
            },
        }


class TokenObtainPairSerializer(TokenObtainPairSerializer):
    """Serializer para obtenção de token JWT."""

    def validate(self, attrs):
        """Valida as credenciais e retorna tokens e dados do usuário."""
        logger.debug("Iniciando a validação do TokenObtainPairSerializer.")
        data = super().validate(attrs)
        user = self.user

        user.authenticated = True
        user.save()

        data["user"] = {
            "email": user.email,
            "id_user": user.id_user,
            "authenticated": user.authenticated,
        }

        logger.info(f"Validação bem-sucedida para o usuário: {user.email}.")
        return data

    def handle_error(self, error):
        """Método para lidar com erros e definir authenticated como false."""
        logger.error(f"Erro na validação do token: {error}.")
        user = self.user
        user.authenticated = False
        user.save()


class BankAccountSerializer(serializers.ModelSerializer):
    """Serializer para gerenciar dados de contas bancárias."""

    class Meta:
        model = models.BankDetails
        fields = [
            "bank_name",
            "account_holder",
            "account_number",
            "agency_code",
            "account_type",
            "cpf",
        ]


class AccommodationSerializer(serializers.ModelSerializer):
    """Serializer para gerenciar dados de acomodações."""

    internal_images = serializers.ListField(
        child=serializers.ImageField(), allow_empty=True
    )

    class Meta:
        model = models.PropertyListing
        fields = [
            "id_accommodation",
            "creator",
            "discount",
            "final_price",
            "registered_bookings",
            "registered_user_bookings",
            "cleaning_fee",
            "consecutive_days_limit",
            "main_cover_image",
            "internal_images",
            "category",
            "room_count",
            "bed_count",
            "bathroom_count",
            "guest_capacity",
            "space_type",
            "address",
            "city",
            "neighborhood",
            "postal_code",
            "uf",
            "wifi",
            "tv",
            "kitchen",
            "washing_machine",
            "parking_included",
            "air_conditioning",
            "pool",
            "jacuzzi",
            "grill",
            "private_gym",
            "beach_access",
            "smoke_detector",
            "fire_extinguisher",
            "first_aid_kit",
            "outdoor_camera",
            "title",
            "description",
            "price_per_night",
            "average_rating",
            "bank_account",
            "created_at",
            "is_active",
        ]

    def create(self, validated_data):
        """Cria e salva uma nova acomodação no banco de dados."""
        logger.info("Iniciando a criação da acomodação.")
        try:
            bank_account_data = validated_data.pop("bank_account", None)
            internal_images = validated_data.pop("internal_images", [])
            main_cover_image = validated_data.pop("main_cover_image", None)
            user = validated_data.get("creator")

            consecutive_days_limit = validated_data.get("consecutive_days_limit", 0)
            if consecutive_days_limit <= 0:
                validated_data["consecutive_days_limit"] = -1

            # Ajusta o preço por noite
            price_per_night = validated_data.get("price_per_night", 0)
            price_per_night = Decimal(price_per_night)
            if price_per_night > 0:
                min_rate = Decimal("0.03")  # 3%
                max_rate = Decimal("0.16")  # 16%
                max_price_for_max_rate = Decimal("1000")
                if price_per_night <= max_price_for_max_rate:
                    rate = min_rate + (max_rate - min_rate) * (
                        price_per_night / max_price_for_max_rate
                    )
                else:
                    rate = max_rate
                price_per_night *= 1 + rate
            validated_data["price_per_night"] = round(price_per_night, 2)

            with transaction.atomic():  # Usar transações para garantir consistência
                # Criação da acomodação
                accommodation = models.PropertyListing.objects.create(**validated_data)
                accommodation_uuid = accommodation.id_accommodation
                logger.info(f"Acomodação criada: {accommodation_uuid}.")

                image_paths = []

                # Renomeia e salva as imagens internas
                for image in internal_images:
                    if isinstance(image, TemporaryUploadedFile):
                        new_filename = f"{uuid.uuid4()}.jpg"
                        image_folder = f"property_images/{accommodation_uuid}/"
                        file_path = os.path.join(image_folder, new_filename)

                        logger.info(f"Salvando imagem {image.name} em {file_path}")
                        if default_storage.save(file_path, image):
                            image_paths.append("media/" + file_path)

                # Atualiza o campo main_cover_image usando a função definida anteriormente
                def set_main_cover_image(main_cover_image, image_paths, accommodation):
                    try:
                        main_cover_image = int(main_cover_image)
                    except (ValueError, TypeError):
                        logger.info(
                            "main_cover_image não foi definido ou não é um número."
                        )
                        return
                    if 0 <= main_cover_image < len(image_paths):
                        accommodation.main_cover_image = image_paths[main_cover_image]
                        logger.info(
                            f"Imagem de capa principal definida como: {image_paths[main_cover_image]}"
                        )
                    else:
                        logger.info(
                            f"Índice inválido ({main_cover_image}) para main_cover_image. Deixando vazio."
                        )

                set_main_cover_image(main_cover_image, image_paths, accommodation)

                accommodation.internal_images = list(map(str, image_paths))
                accommodation.is_active = True
                accommodation.save()
                logger.info(f"URLs das imagens armazenadas: {image_paths}.")

                # Adiciona o UUID da acomodação à lista registered_accommodations do usuário
                user.registered_accommodations.append(str(accommodation_uuid))
                user.save()
                logger.info(
                    f"Acomodação {accommodation_uuid} adicionada ao usuário {user.id_user}."
                )

                # Criação da conta bancária, se houver.
                if bank_account_data:
                    bank_account = models.BankDetails.objects.create(
                        **bank_account_data
                    )
                    accommodation.bank_account = bank_account
                    accommodation.save()
                    logger.info(
                        f"Conta bancária associada à acomodação: {bank_account}."
                    )

                return accommodation
        except Exception as e:
            logger.error(f"Erro ao criar acomodação: {e}")
            raise


class ReviewSerializer(serializers.ModelSerializer):
    user_comment = serializers.UUIDField()
    accommodation = serializers.PrimaryKeyRelatedField(
        queryset=models.PropertyListing.objects.all()
    )
    rating = serializers.IntegerField(min_value=1, max_value=5, required=True)
    comment = serializers.CharField(validators=[validate_comment])

    class Meta:
        model = models.Review
        fields = [
            "id_review",
            "user_comment",
            "accommodation",
            "rating",
            "comment",
            "created_at",
        ]
        read_only_fields = ["created_at"]

    def validate(self, attrs):
        """Valida os dados da review antes de salvar."""
        # Validação do rating
        rating = attrs.get("rating")
        if rating is not None:
            rating_error = validate_rating(rating)
            if rating_error:
                raise serializers.ValidationError({"rating": rating_error})
        # Validação do comentário
        comment = attrs.get("comment")
        if comment:
            comment_error = validate_comment(comment)
            if comment_error:
                raise serializers.ValidationError({"comment": comment_error})
        # Validação do usuário
        user_uuid = attrs.get("user_comment")
        if user_uuid:
            try:
                user_comment = models.UserAccount.objects.get(id_user=user_uuid)
                attrs["user_comment"] = user_comment.id_user
            except models.UserAccount.DoesNotExist:
                raise serializers.ValidationError(
                    {"user_comment": "Usuário não encontrado."}
                )

        # Validação da acomodação
        accommodation = attrs.get("accommodation")
        if accommodation:
            try:
                accommodation_obj = models.PropertyListing.objects.get(
                    id_accommodation=accommodation.id_accommodation
                )
                attrs["accommodation"] = accommodation_obj
            except models.PropertyListing.DoesNotExist:
                raise serializers.ValidationError(
                    {"accommodation": "Acomodação não encontrada."}
                )
        return attrs

    def create(self, validated_data):
        """Cria e salva uma nova review no banco de dados."""
        user = validated_data.get("user_comment")
        try:
            # Cria a instância da review
            review = super().create(validated_data)

            # Atualiza o campo registered_bookings, se necessário (apenas como exemplo)
            if user.registered_bookings is None:
                user.registered_bookings = []

            # Verifica se o ID da acomodação está relacionado a uma reserva
            accommodation_id = str(review.accommodation.id_accommodation)
            if accommodation_id not in user.registered_bookings:
                user.registered_bookings.append(accommodation_id)

            user.save()
            return review
        except ValueError as ve:
            raise serializers.ValidationError(f"Erro de validação: {str(ve)}")
        except Exception as e:
            raise serializers.ValidationError(f"Erro ao criar review: {str(e)}")

    def update(self, instance, validated_data):
        """Atualiza os dados de uma review existente."""
        try:
            review = super().update(instance, validated_data)
            return review
        except Exception as e:
            raise serializers.ValidationError("Erro ao atualizar review.")


class BookingSerializer(serializers.ModelSerializer):
    user_booking = serializers.PrimaryKeyRelatedField(
        queryset=models.UserAccount.objects.all()  # Usa diretamente o queryset para buscar o usuário
    )
    accommodation = serializers.PrimaryKeyRelatedField(
        queryset=models.PropertyListing.objects.all()  # Usa diretamente o queryset para buscar a acomodação
    )

    class Meta:
        model = models.Booking
        fields = [
            "id_booking",
            "user_booking",
            "accommodation",
            "check_in_date",
            "check_out_date",
            "price",
            "is_active",
            "created_at",
        ]

    def _validate_date(self, value):
        """Valida e converte a data para o formato dd-mm-yyyy."""
        if isinstance(value, (datetime, date)):
            return value.date() if isinstance(value, datetime) else value
        try:
            return datetime.strptime(value, "%d-%m-%Y").date()
        except ValueError:
            raise serializers.ValidationError(
                "A data deve estar no formato correto. Use o formato dd-mm-yyyy."
            )

    def validate_check_in_date(self, value):
        return self._validate_date(value)

    def validate_check_out_date(self, value):
        return self._validate_date(value)

    def validate(self, attrs):
        check_in_date = attrs.get("check_in_date")
        check_out_date = attrs.get("check_out_date")
        user_booking = attrs.get("user_booking")
        accommodation = attrs.get("accommodation")
        price = attrs.get("price")

        # Verificar se o usuário existe
        try:
            user = User.objects.get(id_user=user_booking)
        except ObjectDoesNotExist:
            raise serializers.ValidationError(
                {"user_booking": "Usuário não encontrado."}
            )

        # Validação de reservas anteriores do usuário
        user_bookings = user.registered_accommodations_bookings or []
        if str(accommodation) in user_bookings:
            # Se o usuário já reservou esta acomodação, aplica preço sem desconto
            logger.info("Usuário já reservou esta acomodação antes.")
        else:
            # Caso contrário, aplica um desconto de 20%
            price = price * Decimal("0.80")
            logger.info("Desconto de 20% aplicado para novo cliente.")

        # Atualiza o preço no objeto de validação
        attrs["price"] = price

        # Validação do check-in
        check_in_error = validate_check_in_date(check_in_date)
        if check_in_error:
            raise serializers.ValidationError({"check_in_date": check_in_error})

        # Validação do check-out
        check_out_error = validate_check_out_date(check_out_date, check_in_date)
        if check_out_error:
            raise serializers.ValidationError({"check_out_date": check_out_error})

        # Calcular o preço total
        price = attrs.get("price")
        if price and check_in_date and check_out_date:
            total_price = self.calculate_total_price(
                check_in_date, check_out_date, price
            )
            attrs["price"] = total_price  # Aplica o preço total calculado

        return attrs

    def calculate_total_price(self, check_in_date, check_out_date, price):
        """
        Calcula o preço total considerando a quantidade de dias e uma taxa variável.
        - A quantidade de dias é obtida pela diferença entre a data de check-out e check-in.
        - A taxa varia entre 5% e 15% dependendo da quantidade de dias.
        """
        if isinstance(check_in_date, str):
            check_in_date_obj = datetime.strptime(check_in_date, "%d-%m-%Y").date()
        else:
            check_in_date_obj = check_in_date

        if isinstance(check_out_date, str):
            check_out_date_obj = datetime.strptime(check_out_date, "%d-%m-%Y").date()
        else:
            check_out_date_obj = check_out_date

        if check_out_date_obj <= check_in_date_obj:
            raise serializers.ValidationError(
                "A data de check-out deve ser após a data de check-in."
            )

        # Calcula a quantidade de dias
        days_difference = (check_out_date_obj - check_in_date_obj).days

        if days_difference < 1:
            raise serializers.ValidationError(
                "A quantidade de dias deve ser pelo menos 1."
            )

        # Define a taxa baseada na quantidade de dias
        if days_difference <= 3:
            tax_rate = Decimal("1.05")  # 5% de taxa
        elif 4 <= days_difference <= 7:
            tax_rate = Decimal("1.10")  # 10% de taxa
        else:
            tax_rate = Decimal("1.15")  # 15% de taxa
        # Converte o preço para Decimal e aplica a taxa
        price_decimal = Decimal(price)
        total_price = price_decimal * days_difference * tax_rate
        logger.info(f"Entrada: {check_in_date_obj}.")
        logger.info(f"Saida: {check_out_date_obj}.")
        logger.info(f"Dias: {days_difference}.")
        logger.info(f"Taxa: {tax_rate}.")
        logger.info(f"Preço: {price_decimal}.")
        logger.info(f"Total: {total_price}.")

        return total_price

    def create(self, validated_data):
        """Cria e salva uma nova reserva no banco de dados."""
        user = validated_data.get("user_booking")

        try:
            # Cria a reserva primeiro
            instance = super().create(validated_data)

            # Adiciona o ID da reserva ao campo registered_bookings
            if user.registered_bookings is None:
                user.registered_bookings = []
            user.registered_bookings.append(str(instance.id_booking))
            user.save()

            return instance
        except ValueError as ve:
            raise serializers.ValidationError(f"Erro ao validar dados: {str(ve)}")
        except Exception as e:
            raise serializers.ValidationError(
                f"Erro inesperado ao criar reserva: {str(e)}"
            )

    def update(self, instance, validated_data):
        """Atualiza os dados de uma reserva existente."""
        try:
            return super().update(instance, validated_data)
        except Exception as e:
            raise serializers.ValidationError(f"Erro ao atualizar reserva: {str(e)}")
