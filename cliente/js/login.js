$( document ).ready(function() {


    $("#ingresar").click(function(){
        $("#msjError").css({"display":"none"});

        var data = {};
        data.pass = $("#inputPassword").val();
        data.user =  $("#inputUser").val()

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/Login',						
            success: function(data) {

                if (data=="logeado") {
                    window.location.replace("chat.html");
                }else{
                    $("#msjError").css({"display":"block","color":"red"});
                }
                
               
            }
        });





    });

});


