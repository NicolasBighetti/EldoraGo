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
    setCot: function(cot){
      return state.set("cot", cot);
    },
    setIdJoueur: function(idJoueur){
      return state.set("idJoueur", idJoueur);
    },
      setStartTime: function(){
        return state.set("startTime", moment());
    },
    getElapsedTime: function(){
      var now = moment();
      var then = moment(state.get("startTime"));

      var ms = moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"));
      var d = moment.duration(ms);
      var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
      return s
    },
    setIdTeam: function(idTeam){
      return state.set("idTeam", idTeam);
    },
    cots: function($http){
      var cots;
      return $http.get('https://eldorago.herokuapp.com/api/cots').then(function (data) {
       return data.data;
     });

    },
    step: function($http, id){
     var step;
     return $http.get('https://eldorago.herokuapp.com/api/steps/'+id).then(function (data) {

       return data.data;
     });
   },
   quest: function($http, id){
     var quest;
     return $http.get('https://eldorago.herokuapp.com/api/quests/'+id).then(function (data) {

       return data.data;
     });

   },
   poi: function($http, id){
     var poi;
     return $http.get('https://eldorago.herokuapp.com/api/pois/'+id).then(function (data) {

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

      return data;
    })
  },
  joinTeam: function($http, name){
    if(!state.get("idJoueur"))
      return;
    var teamPromise = this.getTeams($http);
    return teamPromise.then(function(result){

      var found = false;
        for(var team in result.data){

          if(result.data[team].name === name){
            found = true;

            result.data[team].players.push(state.get("idJoueur"));
            var req = {
              method: 'PUT',
              url: 'https://eldorago.herokuapp.com/api/teams/'+result.data[team]._id,
              data:{
                players: result.data[team].players
              }
            }
            return $http(req).then(function(result){
                return result;
            })
          }
        }
          if(!found){
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
            return result;
        })
          }
        
    });

  },
  getTeams: function($http){
    var req = {
      method: 'GET',
      url: 'https://eldorago.herokuapp.com/api/teams'
    }
    return $http(req).then(function(data){

      return data;
    })
  },
  getTeamByID: function($http, id){
    var req = {
      method: 'GET',
      url: 'https://eldorago.herokuapp.com/api/teams/'+id
    }

    return $http(req).then(function(data){
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
  },
  getCotSteps: function($http, id){
    var req = {
      method: 'GET',
      url: 'https://eldorago.herokuapp.com/api/cots/'+id
    }
    return $http(req).then(function(result){
      return result;
    })
  },
  getStepsFromID: function($http, id){
    var req = {
      method: 'GET',
      url: 'https://eldorago.herokuapp.com/api/steps/'+id
    }
    return $http(req).then(function(result){
      return result;
    })
  },
  getQuestFromID: function($http, id){
    var req = {
      method: 'GET',
      url: 'https://eldorago.herokuapp.com/api/quests/'+id
    }
    return $http(req).then(function(result){
      return result;
    })
  },
  getRiddleFromID: function($http, id){
    var req = {
      method: 'GET',
      url: 'https://eldorago.herokuapp.com/api/riddles/'+id
    }
    return $http(req).then(function(result){
      return result;
    })
  }
};
});

