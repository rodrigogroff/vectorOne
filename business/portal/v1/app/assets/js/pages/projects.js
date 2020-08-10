
$(function () {

    $(document).ready(function () {
        var api = new Api();
        api.montaMenu();
        api.setupScreen();
        buscaDados();
    });

    $('#busca').on('keypress', function (e) { if (e.which === 13) buscaDados(); });

    function buscaDados() {
        $("#loading").show();
        var api = new Api();
        var params = undefined;
        var p = $('#busca')[0].value;
        if (p !== undefined && p !== '') params = "search=" + p;
        if (params === undefined)
            params = null;
        api.getTokenPortal("projects", params).then(resp => {
            if (resp.unauthorized === true)
                location.href = 'page-login.html';
            else {

                var table = {
                    'id': 'listTable',
                    'header': ['Customer', 'Project', 'Last regression', 'Actions'],
                    'sizes': ['100px', '100px', '200px', '200px'],
                    'data': []
                };

                var badgeOk = "<span class='badge badge-success' title='All test cases passed'>OK</span>";
                var badgeFail = "<span class='badge badge-danger' title='Most test cases failed!'>Error</span>";
                var badgePend = "<span class='badge badge-warning' title='No test case yet'>Pending</span>";

                for (var indexProj = 0; indexProj < resp.payload.results.length; indexProj++) {
                    var arValues = [];
                    var jData = resp.payload.results[indexProj];

                    if (jData.bTutorial === true)
                        continue;
                        
                    var badge = badgePend;
                    if (jData._stStatus == "OK")
                        badge = badgeOk;
                    else if (jData._stStatus == "Error")
                        badge = badgeFail;
                    else if (jData._stStatus == "Pending")
                        badge = badgePend;
                    var log = jData._stLast;
                    if (jData._stLastUser != null && jData._stLastUser != undefined)
                        log += ", <b style='color:white'>" + jData._stLastUser + "</b>";
                    arValues.push(jData._stClientName)
                    arValues.push("<a href='#' id='btnEditProject' dataP='" + jData.id + "'>" + jData.stName + "</a>")
                    arValues.push(log);
                    arValues.push("<button id='btnCenario' class='btn btn-w-md btn-primary mr-3 mb-5' dataP='" + jData.id + "'>Scenarios</button> &nbsp;&nbsp;&nbsp;" + badge)
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

    $("#buscaCenario").on("keydown", function (event) {
        if (event.which == 13)
            loadCenariosCustom();
    });

    function loadCenarios(idProject) {

        buscaDados();

        $('#buscaCenario').attr('idProject', idProject);
        $('#buscaCenario')[0].value = '';

        let api = new Api();
        api.getTokenPortal("project", "id=" + idProject).then(resp => {
            if (resp.unauthorized === true)
                location.href = 'page-login.html';
            else {
                $('#nomeProjeto').text(resp.payload.stName);
                $('#projectSite').text(resp.payload.detail.site);
                let totCenarios = resp.payload.detail.cenarios.length - 1;
                var table = {
                    'id': 'listCenarios',
                    'header': ['Scenario &nbsp;&nbsp;&nbsp;' + "<button class='btn btn-xs btn-outline-warning' id='btnRecursivo' dataP='" + idProject + "'>Regression</button>",
                            'Status'],
                    'sizes': ['300px', '300px'],
                    'data': []
                };
                for (var idxCenario = 0; idxCenario <= totCenarios; idxCenario++) {
                    var jData = resp.payload.detail.cenarios[idxCenario];                    
                    if (jData.publicar === true && jData.ativo === true) 
                    {
                        let id_cenario = jData.id;
                        var arValues = [];
                        arValues.push("<a href='" + jData.linkExterno + "' target='_blank' title='" +jData.objetivo + "'>" + jData.label + "</a><br>")
                        //arValues.push("<button id='btnExecutaCenario' class='btn btn-xs btn-outline-info' dataP='" + idProject + "' oper='ready' dataC='" + id_cenario + "'>Play</a>")
                        let mainValues = "<div class='progress h-15'><div id='mainDataPct" + id_cenario + "_" + idProject + "' dataP='" + idProject + "' dataC='" + id_cenario + "' " +
                            " class='progress-bar bg-primary' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100'>0%</div></div>" +
                            "<p id='mainDataComment" + id_cenario + "_" + idProject + "' style='color:white'></p>" +
                            "<a id='mainDataImgLink" + id_cenario + "_" + idProject + "' target='_blank'>";
                        arValues.push(mainValues);
                        table.data.push(arValues);
                        refreshFunction(idProject, id_cenario);
                    }
                }
                api.tableInsertData(table, 'white', 'black');
                $('#modalCenario').modal('show');
            }
        }).catch((e) => {
            swal("Ops!", e.msg, "error");
        });
    }

    function loadCenariosCustom() {
        buscaDados();
        var idProject = $('#buscaCenario').attr('idProject');
        var _text = $('#buscaCenario')[0].value;
        if (_text === undefined || _text === '')
            _text = '***********';
        else
            _text = _text.toLowerCase();
        let api = new Api();
        api.getTokenPortal("project", "id=" + idProject).then(resp => {
            if (resp.unauthorized === true)
                location.href = 'page-login.html';
            else {
                $('#nomeProjeto').text(resp.payload.stName);
                $('#projectSite').text(resp.payload.detail.site);
                let totCenarios = resp.payload.detail.cenarios.length - 1;
                var table = {
                    'id': 'listCenarios',
                    'header': ['Scenario / Objective',
                        "<button class='btn btn-xs btn-outline-warning' id='btnRecursivo' dataP='" + idProject + "'>Regression</button>",
                        'Status'],
                    'sizes': ['250px', '20px', '300px'],
                    'data': []
                };
                for (var idxCenario = 0; idxCenario <= totCenarios; idxCenario++) {
                    var jData = resp.payload.detail.cenarios[idxCenario];
                    
                    if (jData.publicar === true && jData.ativo === true && jData.label != 'Tutorial') {
                        let id_cenario = jData.id;
                        if (_text !== '***********')
                            if (jData.label.toLowerCase().indexOf(_text) == -1 && jData.objetivo.toLowerCase().indexOf(_text) == -1)
                                continue;
                        var arValues = [];
                        arValues.push("<a href='" + jData.linkExterno + "' target='_blank'>" + jData.label + "</a>")
                        let mainValues = "<div class='progress h-15'><div id='mainDataPct" + id_cenario + "_" + idProject + "' dataP='" + idProject + "' dataC='" + id_cenario + "' " +
                            " class='progress-bar bg-primary' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100'>0%</div></div>" +
                            "<p id='mainDataComment" + id_cenario + "_" + idProject + "' style='color:white'></p>";
                        arValues.push(mainValues);
                        table.data.push(arValues);
                        refreshFunction(idProject, id_cenario);
                    }
                }
                api.tableInsertData(table, 'white', 'black');
                $('#modalCenario').modal('show');
            }
        }).catch((e) => {
            swal("Ops!", e.msg, "error");
        });
    }

    $(document).bind('click', function (e) {
        var target = $(e.target);
        var idProject = target.attr('dataP');
        var id_cenario = $(target).attr('dataC');
        let idName = target.attr('id');
        if (idName !== null && idName !== undefined) {
            if (idName.length >= 8) {
                let idNameSub = idName.substring(0, 8);
                switch (idNameSub) {
                    case 'mainData':
                        {
                            var api = new Api();
                            api.getTokenPortal("projectRunStat", 'idProject=' + idProject + '&idCenario=' + id_cenario).then(resp => {
                                if (resp.unauthorized === true)
                                    location.href = 'page-login.html';
                                else if (resp.payload.currentIndex >= 0) {
                                    if (resp.payload.exception.length > 0)
                                        swal("Scenario Failed!", resp.payload.exception, "error");
                                }
                            });
                            break;
                        }
                }
            }
            switch (idName) {
                case 'btnLogo': location.href = 'index.html'; break;
                case 'btnRefresh': buscaDados(idProject); break;
                case 'btnCenario': loadCenarios(idProject); break;
                case 'btnRecursivo': executaRecursivo(idProject); break;
                case 'btnExecutaCenario': rodaCenario(idProject, id_cenario); break;
                case 'btnRefreshCenarioCustom': loadCenariosCustom(); break;
                default: break;
            }
        }
    });

    function executaRecursivo(idProject) {
        var api = new Api();
        api.getTokenPortal("projectRegression", 'idProject=' + idProject).then(resp => {
            if (resp.unauthorized === true)
                location.href = 'page-login.html';
            else {
                if (resp.ok === true)
                    setTimeout(() => loadCenarios(idProject), 3000);
                else
                    swal("Ops!", resp.msg, "error");
            }
        });
    }

    function rodaCenario(idProject, id_cenario) {
        var api = new Api();
        var pct = $("#mainDataPct" + id_cenario + "_" + idProject);
        var par = 'idProject=' + idProject + '&idCenario=' + id_cenario;
        var percent = 0;
        $(pct).attr('aria-valuenow', percent)
        $(pct).attr('style', `width: ${percent}%`)
        $(pct).attr('class', 'progress-bar bg-info')
        $(pct).text(percent + "%")
        api.getTokenPortal("projectRun", par).then(resp => {
            if (resp.unauthorized === true)
                location.href = 'page-login.html';
            else {
                if (resp.ok === true)
                    setTimeout(() => refreshFunction(idProject, id_cenario), 2000);
                else
                    swal("Ops!", resp.msg, "error");
            }
        }).catch((e) => {
            swal("Ops!", e.msg, "error");
        });
    }

    function refreshFunction(idProject, idCenario) {
        var api = new Api();
        api.getTokenPortal("projectRunStat", 'idProject=' + idProject + '&idCenario=' + idCenario).then(resp => {
            if (resp.unauthorized === true)
                location.href = 'page-login.html';
            else if (resp.payload.currentIndex >= 0) {
                let percent = resp.payload.pct

                if (resp.payload.currentComment !== null && resp.payload.currentComment !== undefined)
                    $("#mainDataComment" + idCenario + "_" + idProject).text(resp.payload.currentComment);

                let pct = $("#mainDataPct" + idCenario + "_" + idProject);
                $(pct).attr('aria-valuenow', percent)
                $(pct).attr('style', `width: ${percent}%`)
                $(pct).text(percent + "%")
                if (resp.payload.bFailed === true) {
                    pct.attr('class', 'progress-bar bg-danger');
                    buscaDados();
                }
                if (percent === 100) {
                    $("#mainDataPct" + idCenario + "_" + idProject).attr('class', 'progress-bar bg-success');
                    $("#mainDataComment" + idCenario + "_" + idProject).text('');
                    buscaDados();
                }
            
                if (resp.payload.currentComment === "(Waiting)" && resp.payload.bActive == true)
                    setTimeout(() => refreshFunction(idProject, idCenario), 15000);
                else
                {
                    if (resp.payload.bActive == true)
                        if (resp.payload.pct < 100)
                            setTimeout(() => refreshFunction(idProject, idCenario), 1000);
                }
            }
        }).catch((e) => {
            swal("Ops!", e.msg, "error");
        });
    }
});
