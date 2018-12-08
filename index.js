var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3001;
var chat = require("./server/chat.js");

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/script.js', function(req, res){
  res.sendFile(__dirname + '/client/js/script.js');
});
app.get('/style.css', function(req, res){
  res.sendFile(__dirname + '/client/css/style.css');
});

chat.start(io);

http.listen(port, function(){
  console.log('listening on *:' + port);
});
