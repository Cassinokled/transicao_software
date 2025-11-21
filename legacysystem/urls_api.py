from django.urls import path
from . import views

urlpatterns = [
    path("clientes/", views.clientes_list, name="clientes_list"),
    path("clientes/create/", views.cliente_create, name="cliente_create"),
    path("clientes/<int:pk>/", views.cliente_update, name="cliente_update"),
    path("clientes/<int:pk>/delete/", views.cliente_delete, name="cliente_delete"),

    path("funcionarios/list/", views.funcionarios_list),
    path("funcionarios/create/", views.funcionario_create),
    path("funcionarios/<int:pk>/", views.funcionario_update),
    path("funcionarios/<int:pk>/delete/", views.funcionario_delete),

]


