
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

    function preload(arrayOfImages) {
        $(arrayOfImages).each(function(){
            $('<img/>')[0].src = this;
        });
    }

    $(document).ready(function () {
        
        preload([
            'assets/images/388352.jpg',           
        ]);

        var x = getUrlVars();

        if (x["verifID"] === null || x["verifID"] === undefined) {
            setTimeout(function() {
                window.location.href = "page-landing.html?verifID=dc7d123e";
            }, 2200);
            return;
        }
    });

});
