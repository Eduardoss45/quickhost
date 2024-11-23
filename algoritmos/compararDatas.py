from datetime import datetime

# Funções de validação


def validate_check_in_date(check_in_date):
    # Verifica se check_in_date é uma string e converte para datetime.date
    if isinstance(check_in_date, str):
        try:
            check_in_date = datetime.strptime(check_in_date, "%Y-%m-%d").date()
        except ValueError:
            return "A data de check-in deve ser uma data válida."

    hoje = datetime.today().date()  # Obtém a data atual sem hora

    # Verifica se a data de check-in é no passado ou no mesmo dia
    if check_in_date <= hoje:
        return "A data de check-in não pode ser no passado nem hoje."

    return None


def validate_check_out_date(check_out_date, check_in_date):
    # Verifica se check_out_date e check_in_date são strings e converte para datetime.date
    if isinstance(check_out_date, str):
        try:
            check_out_date = datetime.strptime(check_out_date, "%Y-%m-%d").date()
        except ValueError:
            return "A data de check-out deve ser uma data válida."

    if isinstance(check_in_date, str):
        try:
            check_in_date = datetime.strptime(check_in_date, "%Y-%m-%d").date()
        except ValueError:
            return "A data de check-in deve ser uma data válida."

    # Verifica se a data de check-out é posterior à data de check-in
    if check_out_date <= check_in_date:
        return "A data de check-out deve ser posterior à data de check-in."

    return None


# Função de testes
def test_validate_dates():
    # Casos de Teste para Check-in
    print("Testando validação de datas de Check-in:")

    # Teste com data válida no futuro
    check_in_test_1 = "2024-12-05"
    result_1 = validate_check_in_date(check_in_test_1)
    print(
        f"Check-in: {check_in_test_1} => {result_1 if result_1 else 'Nenhum erro (válido)'}"
    )

    # Teste com data inválida (no passado)
    check_in_test_2 = "2024-11-20"
    result_2 = validate_check_in_date(check_in_test_2)
    print(
        f"Check-in: {check_in_test_2} => {result_2 if result_2 else 'Nenhum erro (válido)'}"
    )

    # Teste com data inválida (hoje)
    check_in_test_3 = datetime.today().date().strftime("%Y-%m-%d")
    result_3 = validate_check_in_date(check_in_test_3)
    print(
        f"Check-in: {check_in_test_3} => {result_3 if result_3 else 'Nenhum erro (válido)'}"
    )

    # Teste com formato de data inválido
    check_in_test_4 = "2024-02-30"
    result_4 = validate_check_in_date(check_in_test_4)
    print(
        f"Check-in: {check_in_test_4} => {result_4 if result_4 else 'Nenhum erro (válido)'}"
    )

    # Casos de Teste para Check-out
    print("\nTestando validação de datas de Check-out:")

    # Teste com check-out válido após check-in
    check_in_date = "2024-12-01"
    check_out_date = "2024-12-05"
    result_5 = validate_check_out_date(check_out_date, check_in_date)
    print(
        f"Check-in: {check_in_date}, Check-out: {check_out_date} => {result_5 if result_5 else 'Nenhum erro (válido)'}"
    )

    # Teste com check-out no mesmo dia do check-in
    check_out_date_2 = "2024-12-01"
    result_6 = validate_check_out_date(check_out_date_2, check_in_date)
    print(
        f"Check-in: {check_in_date}, Check-out: {check_out_date_2} => {result_6 if result_6 else 'Nenhum erro (válido)'}"
    )

    # Teste com check-out no passado
    check_out_date_3 = "2024-11-30"
    result_7 = validate_check_out_date(check_out_date_3, check_in_date)
    print(
        f"Check-in: {check_in_date}, Check-out: {check_out_date_3} => {result_7 if result_7 else 'Nenhum erro (válido)'}"
    )

    # Teste com formato de data inválido no check-out
    check_out_date_4 = "2024-02-30"
    result_8 = validate_check_out_date(check_out_date_4, check_in_date)
    print(
        f"Check-in: {check_in_date}, Check-out: {check_out_date_4} => {result_8 if result_8 else 'Nenhum erro (válido)'}"
    )


# Rodando os testes
test_validate_dates()
