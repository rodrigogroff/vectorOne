$(function () {
    /*
    -------------------------------------------------
        Main Menu
    -------------------------------------------------
    */
    var header = $('.header');
    var mainMenu = $('.main-menu');

    $(window).scroll(function () {
        if ($(this).scrollTop() > header.height()) {
            mainMenu.addClass('fixed');
        } else {
            mainMenu.removeClass('fixed');
        }
    });

    /*
    -------------------------------------------------
        Mobile Menu
    -------------------------------------------------
    */
    var mobileMenuTrigger = $('.mobile-menu .mm-trigger');
    var mobileMenuBody = $('.mobile-menu .mm-body');

    mobileMenuTrigger.on('click', function (e) {
        e.preventDefault();
        $(this).toggleClass('closed');
        mobileMenuBody.slideToggle();
    });

    var subMenuTrigger = $('.mobile-menu .sub-item-toggle');
    var subMenu = $('.mobile-menu  .sub-menu');

    // side menu sub
    subMenuTrigger.on('click', function (e) {
        e.preventDefault();
        $(this).next().toggleClass("opened").slideToggle("fast");
        $(this).toggleClass("active");

        subMenu.not($(this).next()).slideUp("fast").removeClass("opened");
        subMenuTrigger.not(jQuery(this)).removeClass("active");
    });


    /*
    -------------------------------------------------
        Feather Icon
    -------------------------------------------------
    */
    feather.replace();

    /*
    -------------------------------------------------
        Bootstrap Tooltip / Popover
    -------------------------------------------------
    */

    // popover
    $('[data-toggle*="popover"]').popover();

    // tooltip
    $('[data-toggle="tooltip"]').each(function () {
        var options = {
            html: true
        };

        if ($(this)[0].hasAttribute('data-tooltip-color')) {
            options['template'] =
                '<div class="tooltip ' + $(this).attr('data-tooltip-color') + '" role="tooltip">' +
                '   <div class="arrow"></div>' +
                '   <div class="tooltip-inner"></div>' +
                '</div>';
        }

        $(this).tooltip(options);
    });

    /*
    -------------------------------------------------
        Page Loader
    -------------------------------------------------
    */
    function pageLoader() {
        $(".page-loader").fadeOut("slow");
    };

    $(document).ready(function () {
   //     includeHTML();
        pageLoader();
        $('head').append('<link rel="stylesheet" href="./assets/css/tovvl.dark.css">')
        $('.dark-skin-button').addClass('active');
        $('.dark-skin-button .switch-text').text('Light');
    });

    function includeHTML() {
        var z, i, elmnt, file, xhttp;
        /* Loop through a collection of all HTML elements: */
        z = document.getElementsByTagName("*");
        for (i = 0; i < z.length; i++) {
            elmnt = z[i];
            /*search for elements with a certain atrribute:*/
            file = elmnt.getAttribute("w3-include-html");
            if (file) {
                /* Make an HTTP request using the attribute value as the file name: */
                xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                        if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                        /* Remove the attribute, and call this function once more: */
                        elmnt.removeAttribute("w3-include-html");
                        includeHTML();
                    }
                }
                xhttp.open("GET", file, true);
                xhttp.send();
                /* Exit the function: */
                return;
            }
        }
    }
});
