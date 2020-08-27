
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

        var x = getUrlVars();

        if (window.location.hostname != "slayer.jelastic.saveincloud.net")
        {
            window.location.href = "https://slayer.jelastic.saveincloud.net";
            return;
        }

        if (x["verifID"] === null || x["verifID"] === undefined) {
            var url = window.location.href;
            window.location.href = url + "?verifID=dc7d123e";
            return;
        }

        

    });

});
