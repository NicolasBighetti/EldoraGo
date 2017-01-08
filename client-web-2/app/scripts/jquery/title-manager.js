$(document).ready(function () {

    console.log("JQUERY IN MANAGER");

    $(document).on("click", "#main-navbar a", function () {
        console.log("Hiding title");
        HideTitle();

    });

    $(document).on("click", "#home-icon", function () {
        console.log("Showing title");
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


