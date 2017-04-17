$(document).ready(function () {
    // for sticky footer
    $(window).resize(function () {
        var footerHeight = $('footer').outerHeight();
        $('.push').height(footerHeight);
        $('.wrapper').css({
            marginBottom: '-' + footerHeight + 'px'
        });
    });
    $(window).resize();
});