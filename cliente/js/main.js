
    var direccion = location.href;
    var aux = direccion.split(':');
    var aux2 = aux[2].split('/');
    var ip="http://3.95.85.45:8080";
    var encriptar=false;
    
    
    //var socket = io.connect(ip+aux2[0],{"forceNew":true})
    var socket = io.connect(ip,{"forceNew":true})
    console.log(socket);
    $("#NoPuerto" ).html("<h3  class='form  -text text-muted'>Puerto "+aux[2]+"</h3>")  
    $("#puerto_id" ).val(aux[2]);  


    socket.on("en-linea",function(data){
        $("#conectados").append("<p>  Conectado IP: <strong> "+data+"</strong>.<p>");
       // $("#conectados").append("<p><span class='glyphicon glyphicon-star-empty'></span>si: </p> ");
    });

    socket.on("cambio",function(data){

        $('#ModalPuertos').modal('show');
        
        $('#no_actualizar').click(function(){
            
            var puerto = $("#puerto_id" ).val();
            var link=ip+puerto;
            window.location.replace(link);  
        });

        $('#actualizar').click(function(){
            var link=ip+data;
            window.location.replace(link);  
        });
        
    });


    socket.on("messages",function(data){
        
        audio();
        render(data);
    });


    function audio(){
        var x = document.getElementById("myAudio");
        x.play();
    }

    function render(data){

        var html=data.map(function(message, index){
            // console.log(message.encript);
            // console.log(message);
            if(encriptar){
                if(message.encript=="si"){
                    var msj= Base64.decode(message.text);
                }else{
                    var msj= message.text;
                }   
            }else{
                var msj= message.text;
            }

            return (`
                <div class="message"> 
                    <strong> ${message.nickname}</strong> 
                    <p>${msj}</p>
                </div>
            `);
        }).join(" ");


        var content = document.getElementById("contenedorMessages");
        content.innerHTML = html;
        content.scrollTop = content.scrollHeight ;
    }

    var nombre;
    function addMessage(e){

        
        var encript="no";

        if(encriptar){
            var msj = Base64.encode(document.getElementById("text").value);
            encript="si";
        }else{
            var msj = document.getElementById("text").value;
        }

        var message = {
            nickname : document.getElementById("nickname").value,
            text : msj,
            encript: encript
        }

        socket.emit("add-message",message);
        $("#text").val("");

        return false;
    }

    

    $("#addMessageName").click(function(){

        var message = {
            nickname : document.getElementById("nickname").value,
            text : "he cambiado de nombre a "+ document.getElementById("nickname").value,
        }

        socket.emit("add-message",message);

        $('#ModalConfig').modal('hiden');
        return false;

    });

    $("#selectPuerto").change(function() {

        var puerto = $("#selectPuerto").val();
        var data = {};
        data.puerto = puerto;

        socket.emit("cambio-puerto",data);

        /*$.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/cambioPuerto',						
            success: function(data) {
                var link=ip+puerto;
                window.location.replace(link);
            }
        });*/


    });

    $("#selectEncript").change(function() {

        var aux = $("#selectEncript").val();
        
        if(aux==1){
            encriptar=true;
        }else if(aux==0){
            encriptar=false;
        }

    });

    $("#btnConfig").click(function(){
        $('#ModalConfig').modal('show');
    });

