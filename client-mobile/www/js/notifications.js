angular.module('starter.notifications', [])

.factory('Notifications', function() {

	var notificationsList = [];

	var notificationsRunning = false;

	var pushIntervalID;

	var notificationKind = {
		success : "success",
		info : "info",
		warn : "warn",
		error: "error"
	}

	function notificationPush(){

		if(notificationsList.length > 0 && !notificationsRunning){

			notificationsRunning = true;
			pushIntervalID = setInterval(notificationPush, 5000);
		}
		if(notificationsRunning && notificationsList.length <= 0){

			notificationsRunning = false;
			clearInterval(pushIntervalID);
		}
		if(notificationsRunning){
			var notif = notificationsList.shift();
			$.notify(notif.label, { position:"top center",
									className: notif.kind
									});
		}
	}

	return {
		pushNotification: function(label){

			if(notificationsList.length <= 0 && !notificationsRunning){

				notificationsList.push({
					label: label,
					kind: "info"
				})
				notificationPush();
			}
			else
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
		}

	}
});