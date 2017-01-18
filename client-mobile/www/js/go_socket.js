angular.module('starter.go-socket', ['starter.notifications', 'starter.cot-datas'])
	

.factory('Socket', function(Notifications, CotData) {

	//var datastream = $websocket('ws://localhost:35729/livereload');

	
	var socket = io.connect('ws://eldorago.herokuapp.com/');

	  socket.on('eldoEvent', function (message) {  
        var args = arguments;
       		Notifications.pushNotification(message);
      });
  
  return {
    on: function (eventName, callback) {
      socket.on('eldoEvent', function () {  
        var args = arguments;


      });
    },
    emit: function (data) {
    	var message = CotData.getState().get("nom")+data;
      socket.emit('eldoEvent', message, function () {
        var args = arguments;

      })
    }
  };
});
