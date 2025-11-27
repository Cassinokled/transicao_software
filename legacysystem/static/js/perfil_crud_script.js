document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modalOverlay');
    const btnAlterarSenha = document.getElementById('btnAlterarSenha');
    const btnFechar = document.getElementById('fecharModalSenha');
    const btnSalvar = document.getElementById('salvarSenha');
    const oldPassword = document.getElementById('oldPassword');
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const btnEncerrarSessoes = document.getElementById('btnEncerrarSessoes');

    btnAlterarSenha.addEventListener('click', function() {
        modal.style.display = 'flex';
    });

    btnFechar.addEventListener('click', function() {
        modal.style.display = 'none';
        clearFields();
    });

    btnSalvar.addEventListener('click', function() {
        const oldPass = oldPassword.value.trim();
        const newPass = newPassword.value.trim();
        const confirmPass = confirmPassword.value.trim();

        if (!oldPass || !newPass || !confirmPass) {
            alert('Preencha todos os campos.');
            return;
        }

        if (newPass !== confirmPass) {
            alert('A nova senha e a confirmação não coincidem.');
            return;
        }

        if (newPass.length < 8) {
            alert('A nova senha deve ter pelo menos 8 caracteres.');
            return;
        }

        fetch('/api/change-password/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'old_password': oldPass,
                'new_password': newPass,
                'confirm_password': confirmPass,
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Senha alterada com sucesso!');
                modal.style.display = 'none';
                clearFields();
            } else {
                alert('Erro: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao alterar senha. Tente novamente.');
        });
    });

    function clearFields() {
        oldPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
    }

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            clearFields();
        }
    });

    btnEncerrarSessoes.addEventListener('click', function() {
        window.location.href = '/logout/';
    });
});