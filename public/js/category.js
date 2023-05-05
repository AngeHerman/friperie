$(document).ready (function () {
    $('button.expansible').click(function(e){
        e.preventDefault();
        $(this).next().toggle();
        return false;
    });

});

