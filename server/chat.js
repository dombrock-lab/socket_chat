//set the char for special chat functions
var special_char = "?";

//start the chat
function start(io){
  //setup an array to hold the usernames
  var users = [];
  //setup the users connection
  io.on('connection', function(socket){
    var this_user;
    console.log("A User Connected");

    //setup the new user
    socket.on('new user', function(username){
      var extra = 1;
      username = username.toUpperCase()
      while(users.includes(username)){
        username = username + extra;
        extra = parseInt(extra+1);
      }
      this_user = username;
      io.emit('connection message', username+" Connected!");
      users.push(username);
      io.emit('update users', users);
    });

    //user changes the user name
    socket.on('change username', function(){
      console.log('user disconnected');
      io.emit('connection message', this_user+" Disonnected!");
      io.emit('update users', removeUser(users,this_user));
    });

    //user disconnects
    socket.on('disconnect', function(){
      console.log('user disconnected');
      io.emit('connection message', this_user+" Disonnected!");
      io.emit('update users', removeUser(users,this_user));
    });

    //messages
    socket.on('chat message', function(msg){
      console.log("NEW MESSAGE: "+msg);
      if(msg[0] == special_char){
        specialChat(io,msg,this_user);
      }else{
        io.emit('chat message', msg, this_user);
      }
    });

    socket.on('connection message', function(msg){
      io.emit('connection message', msg);
    });

    socket.on('special message', function(msg){
      io.emit('special message', msg);
    });

    socket.on('exclusive message', function(msg){
      console.log("SENDING EXCLUSIVE MESSAGE TO: "+this_user);
      io.emit('exclusive message', msg, this_user);
    });
  });
}

function removeUser(users,username){
  //console.log("removing: "+username);
  for(user in users){
    //console.log("comparing "+users[user]+" with "+username);
    if(users[user]==username){
      //console.log("Found match at index: "+user);
      //console.log("thats: "+users[user]);
      //console.log(users);
      users.splice(user,1);
      //console.log(users);
      return users;
    }
  }
}

function specialChat(io,msg,username){
  msg = msg.split(special_char).slice(1).join("");
  console.log("special: "+msg);
  switch(msg){
    case "help":
      io.emit('exclusive message', "display help",username);
      break;
  }
}

exports.start = function(io){
    start(io);
}