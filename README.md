# transicao_software


## Pré-requisitos

Git
Python 3.10+
PgAdmin


## Criação do .env (COM INFORMAÇÕES DO BANCO DO POSTGRES)

```bash

#config do banco de dados do PostgresSQL
DB_NAME=nome_do_banco_aqui
DB_USER=user_do_postgres_aqui
DB_PASSWORD=senha_do_postgres_aqui
DB_HOST=host_utilizado_aqui
DB_PORT=porta_utilizada_aqui

# Secret Key do Django
SECRET_KEY=secret_key_do_django_aqui

# Debug (se estiver em desenvolvimento = TRUE, se for para produção = FALSE)
DEBUG=True

```

## Instalação
windowns

```bash
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

linux

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py runserver


```