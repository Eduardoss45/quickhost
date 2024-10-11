import uuid
from django.http import JsonResponse


class UUIDMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Extraia o ID da URL
        if "user/accommodation/create/" in request.path:
            try:
                # Tente obter o ID da URL
                id_user = request.path.split("/")[
                    -2
                ]  # Pega o segundo último segmento da URL
                uuid.UUID(
                    str(id_user)
                )  # Isso levantará um ValueError se não for um UUID válido
            except (ValueError, IndexError):
                return JsonResponse(
                    {"error": "O ID fornecido não corresponde ao formato UUID."},
                    status=400,
                )
        response = self.get_response(request)
        return response
