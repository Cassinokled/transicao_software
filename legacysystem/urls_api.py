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
    
    path("fornecedores/", views.fornecedores_list, name='fornecedor_list'),
    path("fornecedores/create/", views.fornecedor_create, name='fornecedor_create'),
    path("fornecedores/<int:pk>/", views.fornecedor_update, name='fornecedor_update'),
    path("fornecedores/<int:pk>/delete/", views.fornecedor_delete, name='fornecedor_delete'),

    path("produtos/", views.produtos_list, name='produtos_list'),
    path("produtos/create/", views.produto_create, name='produto_create'),
    path("produtos/<int:pk>/", views.produto_update, name='produto_update'),
    path("produtos/<int:pk>/delete/", views.produto_delete, name='produto_delete'),

    path("vendas/", views.vendas_list, name='vendas_list'),
    path("vendas/create/", views.venda_create, name='venda_create'),
    path("vendas/<int:pk>/", views.venda_detail, name='venda_detail'),
    path("vendas/<int:pk>/update/", views.venda_update, name='venda_update'),

]


