angular.module('starter.historique', ['starter.cot-datas'])

.factory('Historique', function() {

	var description = new Map();
	description.set("poi"," a rejoint un nouveau POI");
	description.set("quest"," a démarré une nouvelle quête");
	description.set("team"," a rejoint l\'équipe");

	var icons = new Map();
	icons.set("poi","ion-ios-location");
	icons.set("quest","ion-map");
	icons.set("team","ion-ios-people");

	var color = new Map();
	color.set("poi","primary");
	color.set("quest","warning");
	color.set("team","success");

	var events = [{
	}];

	return {
		all: function(){
			return events;
		},
		desc: function(key){
			return description.get(key);
		},
		icon: function(key){
			return icons.get(key);
		},
		color: function(key){
			return color.get(key);
		},
		getEvents: function($http){
			var req ={
				method: 'GET',
				url: 'https://eldorago.herokuapp.com/api/timelines',				
			}
			return $http(req).then(function(result){
				return result;
			})
		},
		postEvent: function($http, type, timestamp, date,CotData){
			var req = {
				method: 'POST',
				url: 'https://eldorago.herokuapp.com/api/timelines',
				data:{
					action: this.getRandomKeyWord(),
					date_s: date,
					player: CotData.getState().get("idJoueur")  
				}
			}



			return $http(req).then(function(result){

			})
		},
		getTodayDate: function(){
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();

			if(dd<10) {
				dd='0'+dd
			} 

			if(mm<10) {
				mm='0'+mm
			} 

			today = mm+'/'+dd+'/'+yyyy;
			return today;
		},
		getRandomKeyWord: function(){
			var rnd = Math.floor((Math.random() * 3) + 1) - 1;
			if(rnd == 1)
				return "quest";
			else if(rnd == 2)
				return "poi";
			else
				return "team";
		}
	};

});