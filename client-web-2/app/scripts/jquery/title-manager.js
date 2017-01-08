$(document).ready(function () {


    $(document).on("click", "#main-navbar a", function () {
        HideTitle();

    });

    $(document).on("click", "#home-icon", function () {
        ShowTitle();

    });

    

    $("h1.")



    function HideTitle() {
        $("h1").hide();
        $("#hr-home").hide();
    }//HideTitle()

    function ShowTitle() {
        $("h1").show();
        $("#hr-home").show();
    }//ShowTitle()



});


