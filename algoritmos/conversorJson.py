json_data = [
    {"bank_name": "Nubank"},
    {"account_holder": "Eduardo"},
    {"account_number": "1"},
    {"agency_code": "505"},
    {"account_type": "depositos"},
    {"cpf": "1234567890"},
    {"is_company_account": True},
]

# Converte a lista de objetos em um único dicionário
result = {key: value for item in json_data for key, value in item.items()}

print(result)
