
$(function () {

    $(document).ready(function () {
        var api = new Api();
        api.montaMenu();
        api.setupScreen();
        buscaDados();
    });

    $('#busca').on('keypress', function (e) { if (e.which === 13) buscaDados(); });

    function buscaDados() {
        var api = new Api();
        $("#loading").show();
        var params = undefined;
        var p = $('#busca')[0].value;
        if (p !== undefined && p !== '') params = "search=" + p;
        if (params === undefined)
            params = null;
        api.getTokenPortal("users", params).then(resp => {
            if (resp.unauthorized === true)
                location.href = 'page-login.html';
            else {
                var table = {
                    'id': 'listTable',
                    'header': ['Email', 'Login', 'Active', 'Admin', 'Last Login'],
                    'sizes': ['250px', '250px', '90px', '90px', '150px'],
                    'data': []
                };
                for (var i = 0; i < resp.payload.results.length; i++) {
                    var arValues = [];
                    var jData = resp.payload.results[i];
                    arValues.push("<a href='#' id='btnEditUser' dataRef='" + jData.id + "'>" + jData.stEmail + "</a>")
                    arValues.push(jData.stLogin)
                    arValues.push(jData._stAtivo)
                    arValues.push(jData.bAdmin === true ? 'Yes' : 'No')
                    arValues.push(jData._stdtLastLogin)
                    table.data.push(arValues);
                }
                api.tableInsertData(table, 'white', 'blue');
                $('#total').text(resp.payload.total);
                $("#loading").hide();
            }
        }).catch((e) => {
            swal("Ops!", e.msg, "error");
        });
    }

    function focusPrimeiroCampo() {
        setTimeout(function () { $('#novoUsuario_email').focus() }, 500);
    }

    $(document).bind('click', function (e) {
        var target = $(e.target);
        switch (target.attr('id')) {
            case 'btnLogo': location.href = 'index.html'; break;
            case 'btnRefresh': buscaDados(); break;
            case 'btnEditUser':
                {
                    var targetDataRef = target.attr('dataRef');
                    var api = new Api();
                    api.getTokenPortal("user", "id=" + targetDataRef).then(resp => {
                        if (resp.unauthorized === true)
                            location.href = 'page-login.html';
                        else {
                            $('#usuarioEdit')[0].value = targetDataRef;
                            $('#novoUsuario_email')[0].value = resp.payload.stEmail;
                            $('#novoUsuario_login')[0].value = resp.payload.stLogin;
                            $('#novoUsuario_ativo')[0].checked = resp.payload.bActive;
                            $('#novoUsuario_admin')[0].checked = resp.payload.bAdmin;
                            $('#modalDados').modal('show');
                            focusPrimeiroCampo();
                        }
                    }).catch((e) => {
                        swal("Ops!", e.msg, "error");
                    });
                    break;
                }

            default: break;
        }
    });

    $("#btnNovoUsuario").click(function (event) {
        focusPrimeiroCampo();
        limpaDados();
    });

    function limpaDados() {
        $('#usuarioEdit')[0].value = '';
        $('#novoUsuario_email')[0].value = '';
        $('#novoUsuario_login')[0].value = '';
        $('#novoUsuario_ativo')[0].checked = false;
        $('#novoUsuario_admin')[0].checked = false;
    }

    $("#btnSalvarUsuario").click(function (event) {
        var api = new Api();
        var data = JSON.stringify(
            {
                id: Number($('#usuarioEdit')[0].value),
                stEmail: $('#novoUsuario_email')[0].value,
                stLogin: $('#novoUsuario_login')[0].value,
                bActive: $('#novoUsuario_ativo')[0].checked,
                bAdmin: $('#novoUsuario_admin')[0].checked,
            });

        api.postTokenPortal("userNew", data).then(resp => {
            if (resp.unauthorized === true)
                location.href = 'page-login.html';
            else {
                limpaDados();
                buscaDados();
            }
        }).catch((e) => {
            console.log(e);
            swal("Ops!", e.msg, "error");
        });
    });

});
