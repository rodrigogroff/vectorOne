
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
        api.getTokenPortal("reportRegression", null).then(resp => {
            if (resp.unauthorized === true)
                location.href = 'page-login.html';
            else {
                var table = {
                    'id': 'listTable',
                    'header': ['Customer / Project', 'Scenarios', 'Executed by', 'Date / Time', 'Status'],
                    'sizes': ['150px', '90px', '150px', '150px', '250px'],
                    'data': []
                };
                var erroBtn = "<button class='btn btn-xs btn-danger'>Error</button><br>";
                var executandoBtn = "<button class='btn btn-xs btn-black'>Executing</button>";
                var sucessoBtn = "<button class='btn btn-xs btn-success'>OK</button>";

                var execFound = false;

                for (var i = 0; i < resp.payload.log.length; i++) {
                    var c = resp.payload.log[i];
                    var arValues = [];
                    var status = "";
                    switch (c.stStatus) {
                        case "OK": status = sucessoBtn; break;
                        case "Error": status = erroBtn + "Scenario: <span style='color:white'>" + c.stErrorCenario + "</span><br>Error: <span style='color:white'>" + c.stErrorComment + "</span>"; break;
                        case "Executing": status = executandoBtn; execFound = true; break;
                    }
                    arValues.push(c.stClient + "<br><span style='color:white'>" + c.stProject + "</span>")
                    arValues.push(c.stScenes)
                    arValues.push(c.stUser)
                    arValues.push(c.dtRun + "<br><span style='color:white'>" + c.stTempo + "</span>")
                    arValues.push(status)
                    table.data.push(arValues);
                }
                $('#total').text(resp.payload.log.length);
                api.tableInsertData(table, 'white', 'blue');
                $("#loading").hide();

                if (execFound === true)
                    setTimeout(() => buscaDados(), 1000);
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
    });

});
