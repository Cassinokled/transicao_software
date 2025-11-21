## Purpose
This file helps AI coding agents become productive quickly in this Django project by
documenting the repository's architecture, developer workflows, and project-specific conventions.

Follow these concise, actionable notes when making code changes, tests, or debugging.

## Project Overview
- **Project type**: Django web app (project root contains `manage.py`).
- **Main packages**: `core/` (project settings and WSGI/ASGI), `legacysystem/` (single app with models, views, templates, static files).
- **Routing**: `core/urls.py` delegates to `legacysystem.urls` for site pages and `legacysystem/urls_api.py` for simple API endpoints.

## Important Files & Patterns
- **Settings**: `core/settings.py` uses `decouple.config` to read values from a `.env`. Look for `DB_*`, `SECRET_KEY`, and `DEBUG` there — missing `.env` will prevent startup.
- **Database**: By default the project is configured for PostgreSQL. To run locally without Postgres, change `DATABASES` in `core/settings.py` to an SQLite backend.
- **Templates & static**: Templates live in `legacysystem/templates/` and static assets in `legacysystem/static/` (`css/`, `js/`, `icons/`). Use `{% load static %}` and `{% static '...'%}`.
- **Views & routing**: Site pages are implemented in `legacysystem/views.py`. Simple JSON APIs for `clientes` are in `legacysystem/urls_api.py` and implemented in `views.py`.
- **Auth pattern**: `login_view` finds `User` by email and authenticates using that user's `username`. Be careful if changing authentication logic.
- **API pattern**: Client API views use `@csrf_exempt`, `json.loads(request.body)` and validate with Django `Form` classes (e.g., `ClienteForm`). Keep forms+JSON validation consistent.

## Developer workflows (PowerShell)
- Create virtualenv and install:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

- Create `.env` from `README.md` template, then run migrations and start server:

```powershell
python manage.py migrate
python manage.py runserver
```

- Run tests:

```powershell
python manage.py test
```

## Project-specific conventions
- **View names**: Use existing naming (e.g., `login_view`, `dashboard_view`, `clientes_view`).
- **Templates**: Reference templates by filename in `render()` calls (e.g., `render(request, 'login.html')`).
- **Static files**: Keep JS in `legacysystem/static/js/` and CSS in `legacysystem/static/css/`.
- **Site vs API routes**: Update `legacysystem/urls.py` for page routes and `legacysystem/urls_api.py` for JSON endpoints.

## Notable examples & gotchas
- **API mapping**: `legacysystem/urls_api.py` exposes `clientes/` -> `views.clientes_list` and `clientes/create/` -> `views.cliente_create`.
- **Auth caveat**: `login_view` performs `User.objects.get(email=...)` then `authenticate(..., username=user.username, ...)`. Modify carefully.
- **Missing view note**: `legacysystem/urls.py` references `views.funcionarios` but no `funcionarios` is defined in `views.py` — add or remove the URL if changing pages.
- **CSRF & JSON**: API handlers are `@csrf_exempt` and use `json.loads(request.body)` — if you add DRF or AJAX, adjust CSRF and serialization consistently.

## When changing code
- Update templates under `legacysystem/templates/` when modifying view output.
- For model changes run `python manage.py makemigrations` then `python manage.py migrate`.
- Keep `urls_api.py` and `views.py` in sync when adding APIs; maintain the existing `Form` validation pattern or refactor both sides.

## Quick file checklist (where to look first)
- `core/settings.py` — env-backed config and DB settings
- `manage.py` — entry point for commands
- `legacysystem/views.py` — page handlers + cliente API implementations
- `legacysystem/urls.py` and `legacysystem/urls_api.py` — site and API routing
- `legacysystem/templates/` and `legacysystem/static/` — UI files

## Contact / Next steps
If you'd like, I can:
- add an example API test for `clientes`
- switch settings to SQLite for local development
- fix the `funcionarios` URL/view mismatch

Tell me which you'd like and I'll update this doc and the code accordingly.
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
