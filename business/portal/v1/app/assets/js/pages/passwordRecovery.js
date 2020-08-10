
$(function () {

    $(document).ready(function () {
    });

    $("#formRecover").submit(function (event) {

        event.preventDefault();

        var api = new Api();

        var serviceData = {
            email: $('#form-mail')[0].value,
        };

        if (api.isFieldContentValid(serviceData.email) === false) {
            swal("Ops!", "Inform your email correctly", "error");
            return;
        }

        $("#loading").show();

        api.postPublicPortal(JSON.stringify(serviceData), 'recovery').then(resp => {
            $("#loading").hide();
            if (resp.ok === true) {
                swal("Thanks!", "If yout email is registered, we will send your current password!", "success");
            } else {
                api.cleanLogin();
                swal("Ops!", resp.msg, "error");
            }
        }).catch((e) => {
            swal("Ops!", e.msg, "error");
        });
    });

});
