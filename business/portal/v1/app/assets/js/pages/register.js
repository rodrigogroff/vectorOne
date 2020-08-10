
$(function () {

    $(document).ready(function () {
        setTimeout(function () { $('#form-company').focus() }, 500);
    });

    $(document).bind('click', function (e) {
        var target = $(e.target);
        switch (target.attr('id')) {
            case 'btnRegistrar': registrarEmpresa(); break;
        }
    });

    function registrarEmpresa() {

        var serviceData = {
            email: $('#form-mail')[0].value,
            nomeAdmin: $('#form-nomeAdmin')[0].value,
            telefone: $('#form-telAdmin')[0].value,
            empresa: $('#form-company')[0].value,
            website: $('#form-website')[0].value,
            senha: $('#form-pass')[0].value,
        };

        var api = new Api();

        if (api.isFieldContentValid(serviceData.email) === false) {
            setTimeout(function () { $('#form-mail').focus() }, 500);
            return;
        }

        if (api.isFieldContentValid(serviceData.nomeAdmin) === false) {
            setTimeout(function () { $('#form-nomeAdmin').focus() }, 500);
            return;
        }

        if (api.isFieldContentValid(serviceData.empresa) === false) {
            setTimeout(function () { $('#form-company').focus() }, 500);
            return;
        }

        if (api.isFieldContentValid(serviceData.website) === false) {
            setTimeout(function () { $('#form-website').focus() }, 500);
            return;
        }

        if (api.isFieldContentValid(serviceData.telefone) === false) {
            setTimeout(function () { $('#form-telAdmin').focus() }, 500);
            return;
        }

        if (api.isFieldContentValid(serviceData.senha) === false) {
            setTimeout(function () { $('#form-pass').focus() }, 500);
            return;
        }

        if ($('#form-pass')[0].value !== $('#form-pass-conf')[0].value)
        {
            swal("Ops!", "Invalid email confirmation", "error");
            return;
        }

        $("#loading").show();

        api.postPublicPortal(JSON.stringify(serviceData), 'register').then(resp => {
            $("#loading").hide();
            if (resp.ok === true) {
                swal("Thank you!", "Your registration is complete!", "success");
            } else {
                api.cleanLogin();
                swal("Ops!", resp.msg, "error");
            }
        }).catch(err => {
            $("#loading").hide();
            swal("Ops!", err.msg, "error");
        });
    }
});
