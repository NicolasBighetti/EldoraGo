angular.module('starter.cot-datas', [])

.factory('CotData', function() {

	return {
		cots: function($http){
				var cots;
				return $http.get('https://eldorago.herokuapp.com/api/cots').then(function (data) {
    			console.log('Cot get!');
          console.log(data.data);
          return data.data;
  		});
			
		},
		step: function($http, id){
			var step;
				return $http.get('https://eldorago.herokuapp.com/api/steps/'+id).then(function (data) {
    			console.log('Step get!');
          console.log(data);
          return data.data;
  		});
		},
		quest: function($http, id){
			var quest;
				return $http.get('https://eldorago.herokuapp.com/api/quests/'+id).then(function (data) {
    			console.log('Quests get!');
          console.log(data);
          return data.data;
  		});

		},
		poi: function($http, id){
			var poi;
				return $http.get('https://eldorago.herokuapp.com/api/pois/'+id).then(function (data) {
          console.log('Poi get!')
          console.log(data);
          return data.data;
  		});

		},
    addPlayer: function($http, name){
      var req = {
        method: 'POST',
        url: 'https://eldorago.herokuapp.com/api/players',
        data:{
          name: name
        }
      }
      return $http(req).then(function(data){
        console.log('Réponse nom');
        console.log(data);
        return data;
      })
    }
	};
});

