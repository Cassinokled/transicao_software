from django.urls import path
from . import views

urlpatterns = [
    path("clientes/", views.clientes_list, name="clientes_list"),
    path("clientes/create/", views.cliente_create, name="cliente_create"),
    path("clientes/<int:pk>/", views.cliente_update, name="cliente_update"),
    path("clientes/<int:pk>/delete/", views.cliente_delete, name="cliente_delete"),
]
