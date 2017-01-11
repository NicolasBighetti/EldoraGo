angular.module('starter.cot-datas', [])

.factory('CotData', function() {

  var state = new Map();

  return {
    getState: function(){
      return state;
    },
    setIdCot: function(idCot){
      return state.set("idCot", idCot);
    },
    setIdJoueur: function(idJoueur){
      console.log(idJoueur);
      return state.set("idJoueur", idJoueur);
    },
    setIdTeam: function(idTeam){
      return state.set("idTeam", idTeam);
    },
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
        name: name,
        cots:[
        state.get("idCot")
        ]
      }
    }
    return $http(req).then(function(data){
      console.log('Réponse nom');
      console.log(data);
      return data;
    })
  },
  joinTeam: function($http, $scope, name){
    if(state.get("idJoueur"))
      return;
    var teamPromise = this.getTeams($http, name);
    teamPromise.then(function(result){
      console.log("resultat test " + (result.data.length == 0))
        for(var team in result.data){
          if(result.data[team].name == name){
            result.data[team].players.push(state.get("idJoueur"));
            var req = {
              method: 'PUT',
              url: 'https://eldorago.herokuapp.com/api/teams/'+result.data[team]._id,
              data:{
                players: result.data[team].players
              }
            }
            return $http(req).then(function(result){
              console.log("reponse PUT team");
              console.log(result);
                $scope.teamData = result.data;
            })
          }
          else{
              var req = {
          method: 'POST',
          url: 'https://eldorago.herokuapp.com/api/teams',
          data:{
            name: name,
            players:[
            state.get("idJoueur")
            ]
          }
        }
        return $http(req).then(function(result){
            console.log("Result POST TEAM");
            console.log(result);
            $scope.teamData = result.data;
        })
          }
        }
    });
  },
  getTeams: function($http, name){
    var req = {
      method: 'GET',
      url: 'https://eldorago.herokuapp.com/api/teams'
    }
    return $http(req).then(function(data){
      console.log('Réponse get teams');
      console.log(data);
      return data;
    })
  },
  getPlayerNameByID: function($http, id){
    var req = {
      method: 'GET',
      url: 'https://eldorago.herokuapp.com/api/players/' + id
    }
    return $http(req).then(function(result){
      return result;
    })
  }
};
});

