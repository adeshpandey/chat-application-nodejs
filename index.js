var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var usernames = {};
var numUsers = 0;

app.get('/', function(req, res){
  res.sendFile('index.html', { root: __dirname });
});

io.on('connection', function(socket){

	var addedUser = false;

	socket.on('add user',function(name){
		socket.username = name;
		usernames[name] = name;
		++numUsers;
		
		addedUser = true;
	});

	socket.on('typing',function(){
		console.log(socket.username);
		socket.broadcast.emit('typing',{username: socket.username});
	});


	socket.on('stop typing', function () {
		socket.broadcast.emit('stop typing', {
			username: socket.username
		});
	});

	socket.on('chat message', function(msg){

		if(msg.username!=undefined && msg.username!=null) socket.username = msg.username; 
		var name = socket.username || socket.id ;
	    socket.broadcast.emit('chat message',{name:name,message:msg.message });
	  });

    socket.on('disconnect', function(){
    	console.log('user disconnected');
  	});
});


http.listen(3010, function(){
  console.log('listening on *:3010');
});	
