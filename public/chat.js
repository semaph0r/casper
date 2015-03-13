function addMessage(msg, nick){

}

function sendMessage(){

}

function setNick(){

}

socket.on('message', function(data){
	addMessage(data['message'], data['nickName']);
});

$(function(){
	$('#chatControls').hide();
	$('#sendNickname').click(function(){ setNick()});
	$('#sendMessage').click(function(){ sendMessage()});
});