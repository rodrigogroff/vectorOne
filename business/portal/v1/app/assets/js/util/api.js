
const ApiLocation = {
    //api_host: 'http://localhost',
    //api_port: '18524',
    api_host: 'http://node46502-slayer.jelastic.saveincloud.net',
    api_port: '11542',
    api_port_images: '8080',
    api_portal: '/api/v1/portal/',
}

class Api {

    setupScreen() {

        $("#pageDiv").hide();

        var resp = localStorage.getItem('token');
        if (resp == 'null') {
            location.href = 'page-landing.html';
            return;
        }

        var strName = ''; var strCompany = ''; var strAdmin = '';

        var sto_name = localStorage.getItem('user_name');
        var sto_company = localStorage.getItem('company');
        var sto_admin = localStorage.getItem('admin');

        if (sto_name !== undefined) strName = sto_name;
        if (sto_company !== undefined) strCompany = ' - ' + sto_company;

        if (sto_admin !== undefined)
            if (sto_admin === 'true')
                strAdmin = ' (Admin)';

        $('#userName').text(' ' + strName + strCompany + strAdmin);
        $("#pageDiv").show();
    }

    isAuthenticated() {
        return localStorage.getItem('token');
    }

    isFieldContentValid(val) {

        if (val === null) return false;
        if (val === undefined) return false;
        if (val.length === 0) return false;

        return true;
    }

    cleanLogin() {
        localStorage.setItem('token', null)
        localStorage.setItem('email', null)
        localStorage.setItem('user_name', null)
        localStorage.setItem('company', null)
        localStorage.setItem('admin', null)
    }

    loginOk(token, email, userName, company, admin) {
        localStorage.setItem('token', token)
        localStorage.setItem('email', email)
        localStorage.setItem('user_name', userName)
        localStorage.setItem('company', company)
        localStorage.setItem('admin', admin.toString())       
    }

    montaMenu() {

        //https://www.minifier.org/
        //não usar aspas simples dentro do appHeader.html!!!

        var htmlMenu = '<div class="header"><div class="container"><div class="header-left hide-md" style="width:550px"><div class="header-logo logo-type"><img src="assets/images/logo_small.png" href="index.html" style="max-height:50px;cursor:pointer;" id="btnLogo"/>Welcome,<b style="color:white" id="userName"></b></div></div><div class="header-right"><div class="dropdown header-profile"><a href="" data-toggle="dropdown" class="avatar avatar-sm dropdown-toggle"><img src="./assets/images/avatar1.jpg" class="img-responsive" alt="..."></a><div class="dropdown-menu dropdown-menu-right"><div class="header-profile-menu"><a href="page-login.html" class="a dropdown-item"><span class="feather-icon"><i data-feather="power"></i></span>Log out</a></div></div></div></div></div></div><div class="main-menu color-scheme-primary"><div class="container"><ul class="nav"><li class="nav-item sub-item active"><a href="#" class="nav-link sub-item-toggle"><span>Test Suite</span></a><div class="sub-menu"><ul><li class="active"><a href="index.html?v=dc7d123e">Dashboard</a></li></ul></div></li><li class="nav-item sub-item"><a href="#" class="nav-link sub-item-toggle"><span class="feather-icon"><i data-feather="file-text"></i></span><span>Customers</span></a><div class="sub-menu"><ul><li><a href="projects.html?v=dc7d123e">Projects</a></li><li><a href="log_exec.html?v=dc7d123e">Regressions</a></li></ul></div></li><li class="nav-item sub-item"><a href="#" class="nav-link sub-item-toggle"><span class="feather-icon"><i data-feather="file-text"></i></span><span>Configuration</span></a><div class="sub-menu"><ul><li><a href="clients.html?v=dc7d123e">Clients</a></li><li><a href="users.html?v=dc7d123e">Users</a></li></ul></div></li></ul></div></div>';

        var sto_company = localStorage.getItem('company');

        if (sto_company === 'Vortigo')
            htmlMenu = '<div class="header"><div class="container"><div class="header-left hide-md" style="width:550px"><div class="header-logo logo-type"><img src="assets/images/slayer_LOGO.png" href="index.html" style="max-height:50px;cursor:pointer;" id="btnLogo" /> &nbsp;&nbsp;Welcome,<b style="color:white" id="userName"></b></div></div><div class="header-right"><div class="dropdown header-profile"><a href="" data-toggle="dropdown" class="avatar avatar-sm dropdown-toggle"><img src="./assets/images/avatar1.jpg" class="img-responsive" alt="..."></a><div class="dropdown-menu dropdown-menu-right"><div class="header-profile-menu"><a href="page-login.html" class="a dropdown-item"><span class="feather-icon"><i data-feather="power"></i></span>Log out </a></div></div></div></div></div></div><div class="main-menu color-scheme-primary"><div class="container"><ul class="nav"><li class="nav-item sub-item active"><a href="#" class="nav-link sub-item-toggle"><span>Test Suite</span></a><div class="sub-menu"><ul><li class="active"><a href="index.html?v=dc7d123e">Dashboard</a></li></ul></div></li><li class="nav-item sub-item"><a href="#" class="nav-link sub-item-toggle"><span class="feather-icon"><i data-feather="file-text"></i></span><span>Automation</span></a><div class="sub-menu"><ul><li><a href="projects.html?v=dc7d123e">Projects</a></li><li><a href="docs.html?v=dc7d123e">Software</a></li></ul></div></li><li class="nav-item sub-item"><a href="#" class="nav-link sub-item-toggle"><span class="feather-icon"><i data-feather="file-text"></i></span><span>Reports</span></a><div class="sub-menu"><ul><li><a href="log_exec.html?v=dc7d123e">Regressions</a></li></ul></div></li><li class="nav-item sub-item"><a href="#" class="nav-link sub-item-toggle"><span class="feather-icon"><i data-feather="file-text"></i></span><span>Configuration</span></a><div class="sub-menu"><ul><li><a href="clients.html?v=dc7d123e">Customers</a></li><li><a href="users.html?v=dc7d123e">Users</a></li></ul></div></li></ul></div></div>';

        $('#menuTable').html(htmlMenu);
    }

    tableInsertData(tableobj, color, bgColor) {
        $('#' + tableobj.id).html('');
        if (tableobj.data.length > 0) {
            var size = tableobj.header.length;
            var line = "<thead style='background-color:" + bgColor + "';'> <tr>";
            for (var h = 0; h < size; ++h)
                line += "<th style='color:" + color + "' width='" + tableobj.sizes[h] + "'>" + tableobj.header[h] + '</th > ';
            line += "</tr></thead> ";
            $('#' + tableobj.id).append(line);
            var lineData = "<tbody>";
            for (var d = 0; d < tableobj.data.length; ++d) {
                var ar = tableobj.data[d];
                lineData += "<tr>";
                for (var h = 0; h < size; ++h)
                    lineData += "<td>" + ar[h] + "</td>";
                lineData += "</tr>";
            }
            lineData += "</tbody>";
            $('#' + tableobj.id).append(lineData);
        }
        else
            $('#' + tableobj.id).html("<br><button class='btn btn-dark btn-lg'>No results were found</button><br>");
    }

    getTokenPortal(location, parameters) {
        var attempts = 5;
        var _catch = false;
        while (true) {
            var ret = new Promise((resolve, reject) => {
                var _params = '';
                if (parameters !== null)
                    _params = '?' + parameters;
                fetch(ApiLocation.api_host + ':' + ApiLocation.api_port + ApiLocation.api_portal + location + _params,
                    {
                        method: 'GET', headers:
                        {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        }
                    })
                    .then((res) => {
                        if (res.status === 401) {
                            resolve({
                                ok: false,
                                unauthorized: true
                            })
                        }
                        else if (res.status === 400) {
                            res.json().then((data) => {
                                reject({
                                    ok: false,
                                    msg: data.message
                                })
                            });
                        }
                        else if (res.ok === true) {
                            res.json().then((data) => {
                                resolve({
                                    ok: true,
                                    payload: data,
                                })
                            })
                        }
                        else res.json().then((data) => {
                            console.log(data)
                            resolve({
                                ok: false,
                                msg: data.message,
                            })
                        });
                    })
                    .catch((errorMsg) => {
                        _catch = true;
                        resolve({
                            ok: false,
                            msg: errorMsg.message,
                        })
                    });
            })
            if (_catch === true) {
                --attempts;
                if (attempts === 0)
                    return ret;
            }
            else
                return ret;
        }
    }

    postTokenPortal(location, data) {
        var attempts = 5;
        var _catch = false;
        while (true) {
            var ret =
                new Promise((resolve, reject) => {
                    fetch(ApiLocation.api_host + ':' + ApiLocation.api_port +
                        ApiLocation.api_portal + location,
                        {
                            method: 'POST', headers:
                            {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                            },
                            body: data
                        })
                        .then((res) => {
                            if (res.status === 401) {
                                reject({
                                    ok: false,
                                    unauthorized: true
                                })
                            }
                            else if (res.status === 400) {
                                res.json().then((data) => {
                                    reject({
                                        ok: false,
                                        msg: data.message
                                    })
                                });
                            }
                            else if (res.ok === true) {
                                res.json().then((data) => {
                                    resolve({
                                        ok: true,
                                        payload: data,
                                    })
                                })
                            }
                            else res.json().then((data) => {
                                resolve({
                                    ok: false,
                                    msg: data.message,
                                })
                            });
                        })
                        .catch((errorMsg) => {
                            _catch = true;
                            resolve({
                                ok: false,
                                msg: errorMsg.toString(),
                            })
                        });
                })
            if (_catch === true) {
                --attempts;
                if (attempts === 0)
                    return ret;
            }
            else
                return ret;
        }
    }

    postPublicPortal(obj, endPoint) {
        var attempts = 5;
        var _catch = false;
        while (true) {
            var ret = new Promise((resolve, reject) => {
                fetch(ApiLocation.api_host + ':' + ApiLocation.api_port + ApiLocation.api_portal + endPoint,
                    {
                        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: obj
                    })
                    .then((res) => {
                        if (res.status === 400) {
                            res.json().then((data) => {
                                reject({
                                    ok: false,
                                    msg: data.message
                                })
                            });
                        }
                        else if (res.ok === true) {
                            res.json().then((data) => {
                                resolve({
                                    ok: true,
                                    payload: data,
                                })
                            })
                        }
                        else {
                            res.json().then((data) => {
                                resolve({
                                    ok: false,
                                    msg: data.message,
                                })
                            })
                        }
                    })
                    .catch((errorMsg) => {
                        _catch = true;
                        resolve({
                            ok: false,
                            msg: errorMsg.toString(),
                        })
                    });
            })
            if (_catch === true) {
                --attempts;
                if (attempts === 0)
                    return ret;
            }
            else
                return ret;
        }

    }

}
