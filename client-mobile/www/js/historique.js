angular.module('starter.historique', [])

.factory('Historique', function() {

	var description = new Map();
		description.set("poi"," a rejoint un nouveau POI");
		description.set("quete"," a démarré une nouvelle quête");
		description.set("team"," a rejoint l\'équipe");

	var icons = new Map();
		icons.set("poi","ion-ios-location");
		icons.set("quete","ion-map");
		icons.set("team","ion-ios-people");

	var color = new Map();
		color.set("poi","primary");
		color.set("quete","warning");
		color.set("team","success");

	var events = [{
		joueur: 'Mamadou',
		type: 'quete',
		etat: 'debut',
		timestamp: '24/14/2345'
	},{
		joueur: 'Mamadou',
		type: 'quete',
		etat: 'fin',
		timestamp: '235/34/3234'
	},{
		joueur:'Louisgitte',
		type: 'team',
		etat: 'debut',
		timestamp: '12/12/1212'
	},{
		joueur: 'Louisgitte',
		type: 'poi',
		timestamp: '34/56/3123'
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
		}
	};

});