var express = require ("express");
var bodyParser = require('body-parser');

var app = express();
var server = require("http").Server(app);
app.use(bodyParser.json()); 

var io = require("socket.io")(server);

app.use(express.static("cliente"));

app.post('/Login/', function(req, res) {
    var usuario = req.body.user;
    var password = req.body.pass;

    if(usuario=="invitado" && password=="123"){
         res.send("logeado");

    }else{
        res.send("error");
    }

})


var messages =[{
    id: 1,
    text: "Bienvenido al chat privado",
    nickname: "Admin",
    encript: "no",   
}];

io.on("connection",function(socket){
    console.log(socket.handshake.address);
    socket.emit("messages",messages);

    io.sockets.emit("en-linea",socket.handshake.address);

    socket.on("add-message",function(data){
        messages.push(data);
        io.sockets.emit("messages",messages);

    });

    socket.on("cambio-puerto",function(data){
        server.close ();
        server.listen(data.puerto,function(){
            console.log("Cambio de servidor  en el puerto: "+data.puerto);   
        });

        io.sockets.emit("cambio",data.puerto);
    });

});

server.listen(8080,function(){
    console.log("SERVIDOR NODE funcionando en el puerto 8080");
});



