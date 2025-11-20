from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User

# -----------------------------
# VIEWS HTML (SITE)
# -----------------------------

def home(request):
    return render(request, 'home.html')

def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        senha = request.POST.get('password')

        try:
            user_obj = User.objects.get(email=email)
            user = authenticate(request, username=user_obj.username, password=senha)

            if user:
                auth_login(request, user)
                return redirect('dashboard')
            else:
                messages.error(request, 'Email ou senha incorretos.')
        except User.DoesNotExist:
            messages.error(request, 'Email ou senha incorretos.')

    return render(request, 'login.html')

def logout_view(request):
    auth_logout(request)
    return redirect('login')

@login_required(login_url='login')
def dashboard_view(request):
    return render(request, 'dashboard.html')

@login_required(login_url='login')
def perfil_view(request):
    return render(request, 'perfil.html')

@login_required(login_url='login')
def clientes_view(request):
    return render(request, 'clientes.html')

@login_required(login_url='login')
def fornecedores_view(request):
    return render(request, 'fornecedores.html')


# -----------------------------
# API PARA CRUD DE CLIENTES
# -----------------------------

import json
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from .models import Cliente
from .forms import ClienteForm

def cliente_to_dict(cliente):
    return {
        "id": cliente.id,
        "nome": cliente.nome,
        "email": cliente.email,
        "celular": cliente.celular,
        "fixo": cliente.fixo,
        "cod": cliente.cod,
        "endereco": cliente.endereco,
        "cep": cliente.cep,
        "numero": cliente.numero,
        "uf": cliente.uf,
        "bairro": cliente.bairro,
        "cidade": cliente.cidade,
        "complemento": cliente.complemento,
        "rg": cliente.rg,
        "cpf": cliente.cpf,
        "created_at": cliente.created_at.isoformat(),
        "updated_at": cliente.updated_at.isoformat(),
    }

@require_http_methods(["GET"])
def clientes_list(request):
    clientes = Cliente.objects.order_by("cod")
    data = [cliente_to_dict(c) for c in clientes]
    return JsonResponse({"clientes": data})

@csrf_exempt
@require_http_methods(["POST"])
def cliente_create(request):
    data = json.loads(request.body.decode("utf-8"))
    form = ClienteForm(data)
    if form.is_valid():
        cliente = form.save()
        return JsonResponse({"cliente": cliente_to_dict(cliente)}, status=201)
    return JsonResponse({"errors": form.errors}, status=400)

@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
def cliente_update(request, pk):
    try:
        cliente = Cliente.objects.get(pk=pk)
    except Cliente.DoesNotExist:
        return JsonResponse({"error": "Cliente not found"}, status=404)

    data = json.loads(request.body.decode("utf-8"))
    form = ClienteForm(data, instance=cliente)

    if form.is_valid():
        cliente = form.save()
        return JsonResponse({"cliente": cliente_to_dict(cliente)})

    return JsonResponse({"errors": form.errors}, status=400)

@csrf_exempt
@require_http_methods(["DELETE"])
def cliente_delete(request, pk):
    try:
        cliente = Cliente.objects.get(pk=pk)
    except Cliente.DoesNotExist:
        return JsonResponse({"error": "Cliente not found"}, status=404)

    cliente.delete()
    return JsonResponse({"deleted": True})
