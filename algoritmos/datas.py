from datetime import datetime, timedelta

# 1. datetime.now()
print("1. datetime.now()")
current_datetime = datetime.now()
print(f"Data e hora atual: {current_datetime}\n")

# 2. datetime.today()
print("2. datetime.today()")
today = datetime.today()
print(f"Hoje: {today}\n")

# 3. datetime.date()
print("3. datetime.date()")
current_date = current_datetime.date()
print(f"Apenas a data: {current_date}\n")

# 4. datetime.time()
print("4. datetime.time()")
current_time = current_datetime.time()
print(f"Apenas a hora: {current_time}\n")

# 5. datetime.strptime() - Converter string para datetime
print("5. datetime.strptime()")
date_str = "2024-12-01"
date_obj = datetime.strptime(date_str, "%Y-%m-%d")
print(f"Data convertida de string: {date_obj}\n")

# 6. datetime.strftime() - Converter datetime para string
print("6. datetime.strftime()")
formatted_date = current_datetime.strftime("%d/%m/%Y %H:%M:%S")
print(f"Data formatada: {formatted_date}\n")

# 7. datetime.timedelta() - Somando dias
print("7. datetime.timedelta()")
tomorrow = today + timedelta(days=1)
print(f"Amanhã: {tomorrow}\n")

# 8. datetime.replace() - Alterando parte de uma data
print("8. datetime.replace()")
new_datetime = current_datetime.replace(year=2025, month=1)
print(f"Data alterada: {new_datetime}\n")

# 9. datetime.utcnow() - Data e hora em UTC
print("9. datetime.utcnow()")
utc_datetime = datetime.utcnow()
print(f"Data e hora em UTC: {utc_datetime}\n")

# 10. datetime.fromtimestamp() - Convertendo timestamp para datetime
print("10. datetime.fromtimestamp()")
timestamp = 1609459200  # 2021-01-01 00:00:00
dt_from_timestamp = datetime.fromtimestamp(timestamp)
print(f"Data de timestamp {timestamp}: {dt_from_timestamp}\n")

# 11. datetime.timestamp() - Convertendo datetime para timestamp
print("11. datetime.timestamp()")
timestamp_from_dt = current_datetime.timestamp()
print(f"Timestamp da data atual: {timestamp_from_dt}\n")

# 12. datetime.weekday() - Dia da semana (0 = segunda-feira)
print("12. datetime.weekday()")
weekday = current_datetime.weekday()
print(f"Dia da semana (0 = segunda-feira): {weekday}\n")

# 13. datetime.isoweekday() - Dia da semana (1 = segunda-feira)
print("13. datetime.isoweekday()")
iso_weekday = current_datetime.isoweekday()
print(f"Dia da semana (1 = segunda-feira): {iso_weekday}\n")
