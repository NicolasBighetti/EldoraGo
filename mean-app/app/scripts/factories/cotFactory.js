angular.module('eldoragoApp')
  .factory('CotFactory', ['$http', '$q','$rootScope' ,function ($http, $q,$rootScope) {
    var currentCot = {};
    var hasChanged = false;

    //utilitaires
    function removeNullIn(prop, obj) {
      var pr = obj[prop];
      if (pr === null || pr === undefined) delete obj[prop];
      else if (typeof pr === 'object') for (var i in pr) removeNullIn(i, pr);
    }

    function removeNull(obj) {
      for (var i in obj) {
        removeNullIn(i, obj);
      }
    }

    function Combine(obj1, obj2) {
      removeNull(obj2);
      return angular.extend(obj1, obj2);
    }


    //get set
    function getCurrentCot() {
      return currentCot.cot;
    }

    function setCurrentCot(cot) {
      console.log('set cot');
      console.dir(cot);
      if(!cot){
        createCot();
      }else {
        currentCot.cot = cot;
      }
      hasChanged = true;
      $rootScope.$broadcast("updates");
    }

    //CRUD Cot
    function createCot() {

      currentCot.cot = {stepsO:[],steps:[]};
      hasChanged = true;
    }

    function readCot() {
      if (!currentCot.cot || !currentCot.cot._id) {
        console.error('Err no cot defined');
        console.dir(currentCot.cot);
        return;
      }
      $http.get(DB_PATH + "cots/" + currentCot.cot._id).then(function (resp) {
        //$scope.cotSelected = resp.data;
        console.log(resp.data);
        currentCot.cot = resp.data;
        currentCot.cot.stepsO = [];// currentCot.cot.steps;
        for (var s in currentCot.cot.steps) {
          if (currentCot.cot.steps.hasOwnProperty(s) && s) {
            console.log(s);
            readStep(s);
          }

        }
        hasChanged = true;
      }, function (error) {
        alert(error);
      });
    }



    // update all steps
    function updateCot() {

      var questsPromises = [];
      var stepPromises = [];

      //1 créer les promises de post/put les quetes
      for (var st in currentCot.cot.stepsO) {
        for (var qu in currentCot.cot.stepsO[st].questsO) {
          console.log('quest key'+qu +' step k ' + st);
          //console.dir('quest key'+qu +' step k ' + st);

          questsPromises.push($q.defer(CorUQuest(st, qu)));
        }
      }

      //Créer les promises de step
      $q.all(questsPromises).then(function (datas) {
        console.log('Quests Updated');
        console.dir(datas);
        for (var st in currentCot.cot.stepsO) {
          stepPromises.push($q.defer(CorUStep(st)));
        }

        $q.all(stepPromises).then(function (datas) {
          console.log('Steps Updated');
          console.dir(currentCot.cot);
          if(currentCot.cot._id){
            $http.put(DB_PATH +'cots/'+currentCot.cot._id,currentCot.cot).then(function (resp) {
              //currentCot.cot = Combine(currentCot.cot,resp.data);
            },function (err, code) {
              console.log('there was errors in updating cot');
              console.error(err,code);
            });
          } else{
            $http.post(DB_PATH +'cots/',currentCot.cot).then(function (resp) {
              currentCot.cot = Combine(currentCot.cot,resp.data);
              //currentCot.cot._id = resp.data._id;

            },function (err, code) {
              console.log('there was errors in updating cot');
              console.error(err,code);
            });
          }
        }, function (errors) {
          console.log('there was errors in updating steps');
          console.dir(errors);
        });
      }, function (errors) {
        console.log('there was errors in updating quests');
        console.dir(errors);
      });

    }

    function CorUStep(keyS) {
      var st = currentCot.cot.stepsO[keyS];
      var deferred = $q.defer();

      if (st._id) {
        $http.put(DB_PATH + 'steps/' + st._id,st).then(function (resp) {
          //currentCot.cot.stepsO[keyS] = Combine(currentCot.cot.stepsO[keyS], resp.data);
          //toujours faux
          if (currentCot.cot.steps.indexOf(st._id) == -1) {
            currentCot.cot.steps.push(st._id);
          }
          deferred.resolve({keyS: keyS, data: resp.data});
        },function (msg, code) {
          console.error(msg, code);
          deferred.reject(msg);
        });
      } else {
        $http.post(DB_PATH + 'steps/',st).then(function (resp) {
          currentCot.cot.stepsO[keyS] = Combine(currentCot.cot.stepsO[keyS], resp.data);
          //currentCot.cot.stepsO[keyS]._id = resp._id;

          //devrait toujours être vrai
          if (currentCot.cot.steps.indexOf(resp.data._id) == -1) {
            currentCot.cot.steps.push(currentCot.cot.stepsO[keyS]._id);
          }
          deferred.resolve({keyS: keyS, data: resp.data});
        },function (msg, code) {
          console.error(msg, code);
          deferred.reject(msg);
        });
      }
      return deferred.promise;
    }

    function CorUQuest(keyS, keyQ) {
      var qu = currentCot.cot.stepsO[keyS].questsO[keyQ];
      console.log('Create or u Q');
      console.log(qu);
      console.log(keyS + " " + keyQ);
      var deferred = $q.defer();

      if (qu._id) {
        $http.put(DB_PATH + 'quests/' + qu._id,qu).then(function (resp) {
          console.log('162');
          console.dir(resp);
          //currentCot.cot.stepsO[keyS].questsO[keyQ] = Combine(currentCot.cot.stepsO[keyS].questsO[keyQ], resp.data);
          if (currentCot.cot.stepsO[keyS].quests.indexOf(qu._id) == -1) {
            currentCot.cot.stepsO[keyS].quests.push(qu._id);
          }
          deferred.resolve({keyS: keyS, keyQ: keyQ, data: resp.data});
        },function (msg, code) {
          console.error(msg, code);
          deferred.reject(msg);
        });
      } else {
        $http.post(DB_PATH + 'quests/',qu).then(function (resp) {
          //currentCot.cot.stepsO[keyS].questsO[keyQ] = Combine(currentCot.cot.stepsO[keyS].questsO[keyQ], resp.data);

          currentCot.cot.stepsO[keyS].questsO[keyQ]._id = resp.data._id;
          if (currentCot.cot.stepsO[keyS].quests.indexOf(resp.data._id) == -1) {
            currentCot.cot.stepsO[keyS].quests.push(resp.data._id);
          }
          deferred.resolve({keyS: keyS, keyQ: keyQ, data: resp.data});
        },function (msg, code) {
          console.error(msg, code);
          console.error('Create or u Q');
          console.error(qu);
          console.error(keyS + " " + keyQ);
          deferred.reject(msg);
        });
      }
      return deferred.promise;
    }

    function deleteCot() {
    }

    //CRUD Step
    function createStep() {
      var newStep = {
        name: "Nom step",
        desc: "Default",
        questsO:[],
        quests:[]
      };
      cot.stepsO.push(newStep);
      /*$http.post(DB_PATH + "steps", newStep).then(function (resp) {
        newStep = resp.data;
        cot.steps.push(newStep._id);
        cot.stepsO.push(newStep);
        hasChanged = true;
        /!*$http.put(DB_PATH+"cots/"+cot._id, {steps: cot.steps}).then(function(resp) {
         console.log('step was created and added in cot');
         }, function(error) {
         console.error(error);
         fait dans updateCot
         });*!/
      }, function (error) {
        console.error(error);
      });*/
    }


    function readStep(keyS) {

      var id = currentCot.cot.steps[keyS];
      $http.get(DB_PATH + "steps/" + id).then(function (resp) {
        var stepO = resp.data;
        stepO.questsO = [];

        currentCot.cot.stepsO[keyS] = stepO;

        for (var keyQ in stepO.quests) {
          readQuest(keyS, keyQ);
        }
        hasChanged = true;
      }, function (error) {
        console.log(error);
      });
    }

    function updateStep() {

    }

    function deleteStep(key) {

      var toDelete = currentCot.cot.stepsO[key];
      currentCot.cot.stepsO[key].questsO = [];

      //supprimer les quetes
      for(var qt in toDelete.quests){
        var qtO = toDelete.quests[qt];
        $http.delete(DB_PATH + "quests/" + qtO).then(function (resp) {
          console.log("deleted quest");
        },function (err, code) {
          console.error(err,code);
        });
      }

      //supprimer l'objet distant
      if(toDelete._id){
        var index = currentCot.cot.steps.indexOf(toDelete._id);
        if(index != -1){
          currentCot.cot.steps.splice(index, 1);
        }
        $http.delete(DB_PATH + "steps/" + toDelete._id).then(function (resp) {
          console.log("step deleted");
        },function (err, code) {
          console.error(err,code);
        });
      }

      currentCot.cot.stepsO.splice(key, 1);
      updateCot();

    }

    //CRUD Step
    function createQuest(keyS) {
      console.log(keyS);
      var nb = currentCot.cot.stepsO[keyS].questsO.length;
      var newQuest = {
        name: "Quete "+nb,
        desc: "Description de quete"+nb
      };
      console.log(newQuest);
      currentCot.cot.stepsO[keyS].questsO.push(newQuest);
      currentCot.ch = true;
    }

    function readQuest(keyS, keyQ) {
      var id = currentCot.cot.stepsO[keyS].quests[keyQ];

      $http.get(DB_PATH + "quests/" + id).then(function (resp) {

        currentCot.cot.stepsO[keyS].questsO[keyQ] = resp.data;
        hasChanged = true;
        readRiddle(keyS, keyQ);
        readPoi(keyS, keyQ);
      }, function (error) {
        console.log(error);
      });
    }

    function updateQuest() {

    }

    function deleteQuest(keyS,keyQ) {
      var toDelete = currentCot.cot.stepsO[keyS].questsO[keyQ];
      
      if(toDelete._id){
        var index = currentCot.cot.stepsO[keyS].quests.indexOf(toDelete._id);
        if(index != -1){
          currentCot.cot.stepsO[keyS].quests.splice(index, 1);
        }
        $http.delete(DB_PATH + "quests/" + toDelete._id).then(function (resp) {
          console.log("quest deleted");
          
        },function (err, code) {
          console.error(err,code);
        });
      }

      currentCot.cot.stepsO[keyS].questsO.splice(keyQ, 1);
      hasChanged = true;
    }

    //CRUD Riddle
    function createRiddle() {
    }

    function readRiddle(keyS, keyQ) {
      var id = currentCot.cot.stepsO[keyS].questsO[keyQ].riddle;
      if(!id)
        return;
      $http.get(DB_PATH + "riddles/" + id).then(function (resp) {

        currentCot.cot.stepsO[keyS].questsO[keyQ].riddleO = resp.data;
        currentCot.cot.stepsO[keyS].questsO[keyQ].riddle_name = resp.data.name;
        hasChanged = true;
      }, function (error) {
        console.log(error);
      });
    }

    function updateRiddle() {
    }

    function deleteRiddle() {
    }

    function readPoi(keyS, keyQ) {
      var quest = currentCot.cot.stepsO[keyS].questsO[keyQ];
      if(!quest.poi)
        return;
      $http.get(DB_PATH+"pois/" + quest.poi).then(function(resp) {
        quest.poi_name = resp.data.name;
        quest.poiO = resp.data;
        hasChanged = true;
      }, function(error) {

        console.error(error);
      });
    }
    return {
      getCurrentCot: getCurrentCot,

      setCurrentCot: setCurrentCot,
      hasChanged: hasChanged,
      //CRUD Cot
      createCot: createCot,
      readCot: readCot,
      updateCot: updateCot,
      deleteCot: deleteCot,

      //CRUD Step
      createStep: createStep,
      readStep: readStep,
      updateStep: updateStep,
      deleteStep: deleteStep,

      //CRUD Step
      createQuest: createQuest,
      readQuest: readQuest,
      updateQuest: updateQuest,
      deleteQuest: deleteQuest,

      //CRUD Riddle
      createRiddle: createRiddle,
      readRiddle: readRiddle,
      updateRiddle: updateRiddle,
      deleteRiddle: deleteRiddle
    }
  }]);
