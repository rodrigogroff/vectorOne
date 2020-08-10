
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
        api.getTokenPortal("clients", params).then(resp => {
            if (resp.unauthorized === true)
                location.href = 'page-login.html';
            else {
                var table = {
                    'id': 'listTable',
                    'header': ['Name', 'Projects'],
                    'sizes': ['250px', '250px'],
                    'data': []
                };
                for (var i = 0; i < resp.payload.results.length; i++) {                    
                    var arValues = [];
                    var jData = resp.payload.results[i];
                    if (jData.stName != 'Tutorial')
                    {
                        var strProjects = '';
                        for (var j = 0; j < jData._projects.length; ++j) {
                            strProjects += jData._projects[j] + "<br>"
                        }
                        arValues.push("<a href='#' id='btnEditClient' dataRef='" + jData.id + "'>" + jData.stName + "</a>")
                        arValues.push(strProjects)
                        table.data.push(arValues);
                    }
                }
                api.tableInsertData(table, 'white', 'blue');
                $('#total').text(resp.payload.total);

                $("#loading").hide();
            }
        }).catch((e) => {
            swal("Ops!", e.msg, "error");
        });
    }

    $(document).bind('click', function (e) {
        var target = $(e.target);
        switch (target.attr('id')) {
            case 'btnLogo': location.href = 'index.html'; break;
            case 'btnRefresh': buscaDados(); break;
            case 'btnEditClient':
                {
                    var targetDataRef = target.attr('dataRef');
                    var api = new Api();
                    api.getTokenPortal("client", "id=" + targetDataRef).then(resp => {
                        if (resp.unauthorized === true)
                            location.href = 'page-login.html';
                        else {
                            $('#clientEdit')[0].value = targetDataRef;
                            $('#novoCliente_nome')[0].value = resp.payload.stName;
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

    function focusPrimeiroCampo() {
        setTimeout(function () { $('#novoCliente_nome').focus() }, 500);
    }

    $("#btnNovoCliente").click(function (event) {
        focusPrimeiroCampo();
        limpaDados();
    });

    function limpaDados() {
        $('#clientEdit')[0].value = '';
        $('#novoCliente_nome')[0].value = '';
    }

    $("#btnSalvarCliente").click(function (event) {
        var api = new Api();
        var data = JSON.stringify(
            {
                id: Number($('#clientEdit')[0].value),
                stName: $('#novoCliente_nome')[0].value
            });

        api.postTokenPortal("clientNew", data).then(resp => {
            if (resp.unauthorized === true)
                location.href = 'page-login.html';
            else {
                limpaDados();
                buscaDados();
            }
        }).catch((e) => {
            swal("Ops!", e.msg, "error");
        });
    });

});
