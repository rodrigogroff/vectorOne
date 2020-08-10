
$(function () {

    $(document).ready(function () {
        var api = new Api();
        api.montaMenu();
        api.setupScreen();
        buscaDados();
    });

    function buscaDados() {
        var api = new Api();
        $("#loading").show();
        api.setupScreen();
        api.getTokenPortal("statsDashboard", null).then(resp => {
            if (resp.unauthorized === true)
                location.href = 'page-landing.html';
            else {
                $('#totalClients').text(resp.payload.totalClients);
                $('#totalProjects').text(resp.payload.totalProjects);
                $('#totalActiveProjects').text(resp.payload.totalActiveProjects);
                $('#totalFailed').text(resp.payload.totalFailed);

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
        }

        switch (target.attr('redir')) {
            case 'btnClientes': location.href = 'clients.html'; break;
            case 'btnProjetos': location.href = 'projects.html'; break;
            case 'btnRegressoes': location.href = 'log_exec.html'; break;
        }
    });

});
