
$(function () {

    function getUrlVars() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    $(document).ready(function () {

        var api = new Api();

        api.cleanLogin();

        var x = getUrlVars();

        if (x["verifID"] === null || x["verifID"] === undefined) {
            var url = window.location.href;
            window.location.href = url + "?verifID=dc7d123e";
            return;
        }

        $('#form-mail')[0].value = "";
        $('#form-pass')[0].value = "";

        setTimeout(function () { $('#form-mail').focus() }, 500);
    });

    $("#formLogin").submit(function (event) {

        event.preventDefault();

        var serviceData = {
            email: $('#form-mail')[0].value,
            senha: $('#form-pass')[0].value
        };

        var api = new Api();

        if (api.isFieldContentValid(serviceData.email) === false) {
            swal("Ops!", "Email required", "error");
            return;
        }

        if (api.isFieldContentValid(serviceData.senha) === false) {
            swal("Ops!", "Password required", "error");
            return;
        }

        $("#loading").show();

        api.postPublicPortal(JSON.stringify(serviceData), 'authenticate')
            .then(resp => {
                $("#loading").hide();
                if (resp.ok === true) {
                    api.loginOk(
                        resp.payload.token,
                        resp.payload.user.email,
                        resp.payload.user.login,
                        resp.payload.user.company,
                        resp.payload.user.admin,
                    );
                    location.href = 'index.html?v=dc7d123e';
                } else {
                    api.cleanLogin();
                    swal("Ops!", resp.msg, "error");
                }
            })
            .catch(err => {
                $("#loading").hide();
                swal("Ops!", err.msg, "error");
            });
    });
});  