## Purpose
This file helps AI coding agents become productive quickly in this Django project.

Follow these concise, actionable notes when making code changes, tests, or debugging.

## Project Overview
- **Project type**: Django web app (project root contains `manage.py`).
- **Main packages**: `core/` (project settings and WSGI/ASGI), `legacysystem/` (single app with models, views, templates, static files).
- **Routing**: `core/urls.py` includes `legacysystem.urls`. See `legacysystem/urls.py` for app routes (e.g., `home`, `login`, `dashboard`, `clientes`, `fornecedores`).

## Important Files & Patterns
- **Settings**: `core/settings.py` uses `decouple.config` for secrets and DB config. Expect a `.env` (see README) with `DB_*`, `SECRET_KEY`, `DEBUG`.
- **Database**: `core/settings.py` is configured for PostgreSQL (ENV-backed). Do not assume `db.sqlite3` is used — confirm `DATABASES` in `core/settings.py` before migrations.
- **Templates & static**: App templates live in `legacysystem/templates/` and static assets in `legacysystem/static/` (css, js). Views return template names directly — update templates when changing view output.
- **Migrations**: `legacysystem/migrations/` holds schema migrations. Use standard Django migration workflow.
- **Tests**: App tests are in `legacysystem/tests.py`. Run via `python manage.py test legacysystem`.

## Developer workflows (commands)
- Create virtualenv (Windows PowerShell):

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

- Run migrations and development server (env required):

```powershell
# ensure .env exists with DB_* and SECRET_KEY
python manage.py migrate
python manage.py runserver
```

- Run tests:

```powershell
python manage.py test
```

## Project-specific conventions
- The app `legacysystem` contains view functions named like `home`, `login_view`, `dashboard_view`, `clientes_view`, `fornecedores_view` — follow the existing naming when adding new view functions.
- Templates are referenced by filename only; `TEMPLATES['APP_DIRS']` is True, so place templates under `legacysystem/templates/`.
- Static files are served from `legacysystem/static/` during development; keep client-side JS under `static/js/` and CSS under `static/css/` to match existing structure.

## Integration points & gotchas
- The project uses `python-decouple` (`decouple.config`) — a missing `.env` will break startup. Use the README's `.env` template.
- `core/settings.py` currently configures PostgreSQL via env vars; if you need SQLite temporarily, update `DATABASES` accordingly for local testing.
- Admin site is enabled at `/admin/` — migrations and superuser creation may be required.

## Examples to reference
- Route mapping: `core/urls.py` delegates to `legacysystem.urls` (single-app routing).
- Key view: `legacysystem/views.py` contains handlers that render templates in `legacysystem/templates/` and use `legacysystem/static/` assets.

## When changing code
- Update templates under `legacysystem/templates/` when modifying view output.
- If model/schema changes are made, create and apply migrations (`python manage.py makemigrations` then `migrate`).
- Run `python manage.py test` for the affected app to validate behavior.

## Contact / Next steps
If anything in these notes is unclear or you want more detail about a file or workflow, tell me which area to expand (settings, routing, templates, static assets, or DB setup).
