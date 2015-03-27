var socket = io();

function addMessage(msg){
	$('ul#messageList').append('<li class="messageEntry">' + msg + '</li>');
}

function sendMessage(){
	if($('#chatMessage').val() != ""){
		socket.emit('message', $('#chatMessage').val());
		addMessage($('#chatMessage').val());
		$('#chatMessage').val("");
	}
}

function setNick(){
	
}

socket.on('message', function(data){
	addMessage(data['message'], data['nickName']);
});

$(function(){
	//$('.chatControls').hide();
	$('.sendNickname').click(function(){ setNick()});
	$('.sendMessage').click(function(){ sendMessage()});
	$(document).keypress(function(e) {
    if(e.which == 13) {
        sendMessage();
    }
});
});