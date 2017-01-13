angular.module('starter.notifications', [])

.factory('Notifications', function() {

	var notificationsList = [];

	var notificationsRunning;

	var notificationKind = {
		success : "success",
		info : "info",
		warn : "warn",
		error: "error"
	}

	function notificationPush(){
		if(notificationsList.length > 0){
			console.log("notifyyyyyy");
			console.log(notificationsList);
			setInterval(notificationPush, 5000);
			var notif = notificationsList.shift();
			$.notify(notif.label, notif.kind, { position:"top center" });
		}
		else
			setInterval(notificationPush, 5000);
	}

	return {
		pushNotification: function(label){
			notificationsList.push({
				label: label,
				kind: "info"
			})
		},

		pushNotificationKind: function(label, kind){
			notificationsList.push({
				label: label,
				kind: kind
			})
		},
		getKinds: function(){
			return notificationKind;
		},
		startNotifications: function(){
			notificationsRunning = true;
			notificationPush();
		},
		stopNotifications: function(){
			notificationsRunning = false;
		}

}
});