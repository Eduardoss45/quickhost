from datetime import date
import re


def validate_birth_date(birth_date):
    """Valida a data de nascimento do usuário.

    Args:
        birth_date (date): Data de nascimento a ser validada.

    Returns:
        str or None: Mensagem de erro se inválido, ou None se válido.
    """
    if not isinstance(birth_date, date):
        return "Formato de data inválido."
    today = date.today()
    age = (
        today.year
        - birth_date.year
        - ((today.month, today.day) < (birth_date.month, birth_date.day))
    )

    if birth_date >= today:
        return "Data de nascimento inválida. A data deve estar no passado."
    if age < 18:
        return "O usuário deve ter pelo menos 18 anos."
    return None


def validate_phone_number(phone_number):
    """Valida o número de telefone do usuário.

    Args:
        phone_number (str): Número de telefone a ser validado.

    Returns:
        str or None: Mensagem de erro se inválido, ou None se válido.
    """
    if phone_number is None or not re.match(r"^\+?1?\d{9,15}$", phone_number):
        return "Número de telefone inválido. Certifique-se de que tem entre 9 e 15 dígitos, incluindo o código do país, se aplicável."
    return None


def validate_username(username):
    """Valida o nome de usuário do usuário.

    Args:
        username (str): Nome de usuário a ser validado.

    Returns:
        str or None: Mensagem de erro se inválido, ou None se válido.
    """
    if username is None or len(username) < 3:
        return "O nome de usuário deve ter pelo menos 3 caracteres."
    if not all(c.isalnum() or c.isspace() or c in "-_" for c in username):
        return "O nome de usuário deve conter apenas caracteres alfanuméricos, espaços, - e _. "
    return None


def validate_email(email):
    """Valida o formato do e-mail do usuário.

    Args:
        email (str): E-mail a ser validado.

    Returns:
        str or None: Mensagem de erro se inválido, ou None se válido.
    """
    if email is None or not re.match(
        r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", email
    ):
        return "Formato de e-mail inválido."
    return None


def validate_social_name(social_name):
    """Valida o nome social do usuário.

    Args:
        social_name (str): Nome social a ser validado.

    Returns:
        str or None: Mensagem de erro se inválido, ou None se válido.
    """
    if social_name is None or len(social_name) < 2:
        return "O nome social deve ter pelo menos 2 caracteres."
    return None


def validate_profile_picture(profile_picture):
    """Valida a imagem de perfil do usuário.

    Args:
        profile_picture (File or str): Imagem a ser validada, podendo ser um arquivo ou uma URL.

    Returns:
        str or None: Mensagem de erro se inválido, ou None se válido.
    """
    print("Dados recebidos para validação:", profile_picture)

    if isinstance(profile_picture, str) and profile_picture.startswith("http"):
        # Retorna None se for uma URL, ignorando-a
        return None

    # Verifica se profile_picture é um arquivo
    if not hasattr(profile_picture, "name") or not hasattr(profile_picture, "size"):
        raise serializers.ValidationError("Arquivo de imagem inválido.")

    valid_extensions = ["jpg", "jpeg", "png", "gif"]
    if not any(profile_picture.name.lower().endswith(ext) for ext in valid_extensions):
        return "Imagem de perfil inválida. Formatos suportados: jpg, jpeg, png, gif."

    if profile_picture.size > 5 * 1024 * 1024:
        return "A imagem de perfil deve ter no máximo 5MB."

    return None


def validate_emergency_contact(emergency_contact):
    """Valida o contato de emergência do usuário.

    Args:
        emergency_contact (str): Contato de emergência a ser validado.

    Returns:
        str or None: Mensagem de erro se inválido, ou None se válido.
    """
    return validate_phone_number(emergency_contact)


def validate_authenticated(authenticated):
    """Valida se o valor de autenticado é booleano.

    Args:
        authenticated (bool): Valor a ser validado.

    Returns:
        str or None: Mensagem de erro se inválido, ou None se válido.
    """
    if authenticated not in [True, False]:
        return "Autenticado deve ser True ou False."
    return None


def validate_password(password):
    """Valida a senha do usuário.

    Args:
        password (str): Senha a ser validada.

    Returns:
        str or None: Mensagem de erro se inválido, ou None se válido.
    """
    if password is None or len(password) < 8:
        return "A senha deve ter pelo menos 8 caracteres."
    if not re.search(r"\d", password):
        return "A senha deve conter pelo menos um número."
    if not re.search(r"[A-Z]", password):
        return "A senha deve conter pelo menos uma letra maiúscula."
    if not re.search(r"[a-z]", password):
        return "A senha deve conter pelo menos uma letra minúscula."
    return None


def validate_internal_images(internal_images):
    """Valida as imagens da acomodação"""

    if not hasattr(image, "name") or not hasattr(image, "size"):
        return False
    valid_extensions = ["jpg", "jpeg", "png", "gif"]
    if not any(image.name.lower().endswith(ext) for ext in valid_extensions):
        return False
    if image.size > 5 * 1024 * 1024:  # 5 MB
        return False
    return True


def generate_random_filename(self, length=14):
    """Gera um nome de arquivo aleatório com o tamanho especificado."""
    characters = string.ascii_letters + string.digits
    random_name = "".join(random.choice(characters) for _ in range(length))
    return random_name


def validate_room_count(room_count):
    """Valida o número de quartos da acomodação.

    Args:
        room_count (int): Número de quartos a ser validado.

    Returns:
        str or None: Mensagem de erro se inválido, ou None se válido.
    """
    if room_count < 1 or room_count > 20:
        return "O número de quartos deve ser entre 1 e 20."
    return None


def validate_bed_count(bed_count):
    """Valida o número de camas da acomodação.

    Args:
        bed_count (int): Número de camas a ser validado.

    Returns:
        str or None: Mensagem de erro se inválido, ou None se válido.
    """
    if bed_count < 1 or bed_count > 20:
        return "O número de camas deve ser entre 1 e 20."
    return None


def validate_bathroom_count(bathroom_count):
    """Valida o número de banheiros da acomodação.

    Args:
        bathroom_count (int): Número de banheiros a ser validado.

    Returns:
        str or None: Mensagem de erro se inválido, ou None se válido.
    """
    if bathroom_count < 1 or bathroom_count > 20:
        return "O número de banheiros deve ser entre 1 e 20."
    return None


def validate_guest_capacity(guest_capacity):
    """Valida a capacidade de hóspedes da acomodação.

    Args:
        guest_capacity (int): Capacidade de hóspedes a ser validada.

    Returns:
        str or None: Mensagem de erro se inválido, ou None se válido.
    """
    if guest_capacity < 1 or guest_capacity > 20:
        return "A capacidade de hóspedes deve ser entre 1 e 20."
    return None


def validate_price_per_night(price_per_night):
    """Valida o preço por noite da acomodação.

    Args:
        price_per_night (float): Preço por noite a ser validado.

    Returns:
        str or None: Mensagem de erro se inválido, ou None se válido.
    """
    if price_per_night < 0:
        return "O preço por noite deve ser um valor positivo."
    return None


def validate_main_cover_image(main_cover_image, internal_images):
    """Valida a imagem de capa da acomodação.

    Args:
        main_cover_image (str): Imagem de capa a ser validada.
        internal_images (list): Lista de imagens internas.

    Returns:
        str or None: Mensagem de erro se inválido, ou None se válido.
    """
    if main_cover_image and main_cover_image not in internal_images:
        return "A imagem da capa deve ser uma das imagens internas."
    return None
