var socket;
var connected = false;
var user_name;

function startChat(){
  user_name = $("#name").val();
  if(!connected){
    connected = true;
    socket = io();
    //socket.emit('connection message', user_name+" Connected!");
    socket.emit('new user', user_name);
    $('form').submit(function(){
      var message = $('#m').val();
      socket.emit('chat message', message);
      $('#m').val('');
      return false;
    });
    socket.on('chat message', function(msg, username){
      $('#messages').append($('<div class="username">').text(username+": "));
      $('#messages').append($('<li>').text(msg));
      window.scrollTo(0, document.body.scrollHeight);
    });
    socket.on('connection message', function(msg){
      $('#messages').append($('<li class="connection_message">').text(msg));
      window.scrollTo(0, document.body.scrollHeight);
    });
    socket.on('special message', function(msg){
      $('#messages').append($('<li class="special_message">').text(msg));
      window.scrollTo(0, document.body.scrollHeight);
    });
    socket.on('exclusive message', function(msg, username){
      //alert("Looking for "+username);
      //broken
      if(username==user_name){
        $('#messages').append($('<li class="special_message">').text(msg));
        window.scrollTo(0, document.body.scrollHeight);
      }
    });
    socket.on('update users', function(users){
      $('#users-list').html("");
      for(user in users){
        $('#users-list').append($('<li class="">').text(users[user]));
      }
    });
  }
  else{
    //user has already connect and is just changing their username
    socket.emit("change username");
    socket.emit('new user', user_name);
  }
  
}

function styleUsername(user_name){
  return "<span class='username'>"+user_name+"</span>";
}

function toggleUserList(){
  $("#users-area").fadeToggle();
}