angular.module('eldoragoApp')
  .factory('CotFactory', ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {
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


    //CRUD Cot
    function createCot() {
      currentCot.cot = {name: 'nom par default', desc: 'desc par default', stepsO: [], steps: [], pois: [],step_sel: 0};
      console.info('Cot created');
      hasChanged = true;
      return updateCot();
    }

    function setCurrentCot(cot) {
      currentCot.cot = cot;
    }

    function readCot() {

      var defer = $q.defer();

      if (!currentCot.cot || !currentCot.cot._id) {
        console.error('Err no cot defined');
        console.dir(currentCot.cot);
        defer.resolve({});
        return defer.promise;
      }

      var stepP = [];
      var questP = [];

      $http.get(DB_PATH + "cots/" + currentCot.cot._id).then(function (resp) {
        //$scope.cotSelected = resp.data;
        console.log(resp.data);
        currentCot.cot = resp.data;
        
        if(resp.data.steps.length>0)
          currentCot.cot.step_sel = 0;

        //convert date
        if (currentCot.cot.time_est) {
          currentCot.cot.time_estO = minuteToS(currentCot.cot.time_est);
        }
        if (currentCot.cot.limited_time) {
          currentCot.cot.limited_timeO = minuteToS(currentCot.cot.limited_time);
        }

        currentCot.cot.stepsO = [];// currentCot.cot.steps;
        currentCot.cot.pois = [];// currentCot.cot.steps;
        for (var s in currentCot.cot.steps) {
          if (currentCot.cot.steps.hasOwnProperty(s) && s) {
            stepP.push(readStep(s));
          }
        }

        $q.all(stepP).then(function (resp) {
          console.dir(currentCot.cot);
          for (var keyu in currentCot.cot.stepsO) {
            var stepO = currentCot.cot.stepsO[keyu];
            for (var keyQ in stepO.quests) {
              console.log(keyu);
              questP.push(readQuest(keyu, keyQ));
            }
          }
          $q.all(questP).then(function (resp) {

            defer.resolve(resp);
          }, function (error) {
            console.error(error);
          });
        }, function (error) {
          defer.reject(resp);
        });

      }, function (error) {
        console.error(error);
        defer.reject(error);

      });
      return defer.promise;

    }


    // update all steps
    function updateCot() {
      if (!currentCot.cot) {
        console.error('try to update without cot')
        return;
      }
      var promiseAllPost = $q.defer();

      var questsPromises = [];
      var stepPromises = [];

      //1 créer les promises de post/put les quetes
      for (var st in currentCot.cot.stepsO) {
        for (var qu in currentCot.cot.stepsO[st].questsO) {
          console.log('quest key' + qu + ' step k ' + st);
          //console.dir('quest key'+qu +' step k ' + st);

          questsPromises.push(CorUQuest(st, qu));
        }
      }

      //Créer les promises de step
      $q.all(questsPromises).then(function (datas) {
        console.log('Quests Updated');
        console.dir(datas);
        for (var st in currentCot.cot.stepsO) {
          stepPromises.push(CorUStep(st));
        }


        $q.all(stepPromises).then(function (datas) {
          console.log('Steps Updated');
          console.dir(currentCot.cot);

          console.log('Sending cot');


          if (currentCot.cot.time_estO) {
            currentCot.cot.time_est = toMinute(currentCot.cot.time_estO);
          }
          if (currentCot.cot.limited_timeO) {
            currentCot.cot.limited_time = toMinute(currentCot.cot.limited_timeO);
          }

          //clean remove and set steps Ids
          var newStepsIDs = currentCot.cot.stepsO.map(function (a) {
            return a._id;
          });

          //delete not present in O
          for (var q in currentCot.cot.steps) {
            var stepID = currentCot.cot.steps[q];
            if (newStepsIDs.indexOf(stepID) < 0) {
              $http.delete(DB_PATH + 'steps/' + stepID);
            }
          }

          currentCot.cot.steps = newStepsIDs;


          if (currentCot.cot._id) {
            $http.put(DB_PATH + 'cots/' + currentCot.cot._id, currentCot.cot).then(function (resp) {
              console.log('Put Object');

              console.log('Local' + currentCot.cot);
              console.dir(currentCot.cot);

              console.log('Distant' + resp.data);
              console.dir(resp.data);

              promiseAllPost.resolve(resp.data);
              //currentCot.cot = Combine(currentCot.cot,resp.data);
            }, function (err, code) {
              console.log('there was errors in updating cot');
              console.error(err, code);
              promiseAllPost.reject(err, code);

            });
          } else {

            $http.post(DB_PATH + 'cots/', currentCot.cot).then(function (resp) {
              // currentCot.cot = Combine(currentCot.cot,resp.data);
              currentCot.cot._id = resp.data._id;
              promiseAllPost.resolve(currentCot.cot);

            }, function (err, code) {
              console.log('there was errors in updating cot');
              console.error(err, code);
              promiseAllPost.reject(err, code);
            });
          }
        }, function (errors) {
          console.log('there was errors in updating steps');
          console.dir(errors);
          promiseAllPost.reject(errors);

        });
      }, function (errors) {
        console.log('there was errors in updating quests');
        console.dir(errors);
        promiseAllPost.reject();

      });
      return promiseAllPost.promise;
    }

    function CorUStep(keyS) {
      var st = currentCot.cot.stepsO[keyS];
      var newQuestsID = st.questsO.map(function (a) {
        return a._id;
      });

      //delete not present in O
      for (var q in currentCot.cot.stepsO[keyS].quests) {
        var questID = currentCot.cot.stepsO[keyS].quests[q];
        if (newQuestsID.indexOf(questID) < 0) {
          $http.delete(DB_PATH + 'quests/' + questID);
          console.log('deleted quest ' + questID)
        }
      }
      currentCot.cot.stepsO[keyS].quests = newQuestsID;

      var deferred = $q.defer();
      st.pos = keyS;
      if (st._id) {
        $http.put(DB_PATH + 'steps/' + st._id, st).then(function (resp) {
          //currentCot.cot.stepsO[keyS] = Combine(currentCot.cot.stepsO[keyS], resp.data);
          //toujours faux
          if (currentCot.cot.steps.indexOf(st._id) == -1) {
            currentCot.cot.steps.push(st._id);
          }
          deferred.resolve({keyS: keyS, data: resp.data});
        }, function (msg, code) {
          console.error(msg, code);
          deferred.reject(msg);
        });
      } else {
        $http.post(DB_PATH + 'steps/', st).then(function (resp) {
          currentCot.cot.stepsO[keyS] = Combine(currentCot.cot.stepsO[keyS], resp.data);
          //currentCot.cot.stepsO[keyS]._id = resp._id;

          //devrait toujours être vrai
          if (currentCot.cot.steps.indexOf(resp.data._id) == -1) {
            currentCot.cot.steps.push(currentCot.cot.stepsO[keyS]._id);
          }
          deferred.resolve({keyS: keyS, data: resp.data});
        }, function (msg, code) {
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
        $http.put(DB_PATH + 'quests/' + qu._id, qu).then(function (resp) {
          console.log('162');
          console.dir(resp);
          //currentCot.cot.stepsO[keyS].questsO[keyQ] = Combine(currentCot.cot.stepsO[keyS].questsO[keyQ], resp.data);
          if (currentCot.cot.stepsO[keyS].quests.indexOf(qu._id) == -1) {
            currentCot.cot.stepsO[keyS].quests.push(qu._id);
          }
          deferred.resolve({keyS: keyS, keyQ: keyQ, data: resp.data});
        }, function (msg, code) {
          console.error(msg, code);
          deferred.reject(msg);
        });
      } else {
        $http.post(DB_PATH + 'quests/', qu).then(function (resp) {

          currentCot.cot.stepsO[keyS].questsO[keyQ]._id = resp.data._id;
          if (currentCot.cot.stepsO[keyS].quests.indexOf(resp.data._id) == -1) {
            currentCot.cot.stepsO[keyS].quests.push(resp.data._id);
          }
          deferred.resolve({keyS: keyS, keyQ: keyQ, data: resp.data});
        }, function (msg, code) {
          console.error(msg, code);
          console.error('Create or u Q');
          console.error(qu);
          console.error(keyS + " " + keyQ);
          deferred.reject(msg);
        });
      }
      return deferred.promise;
    }

    function toMinute(time){
      var dateS = "1/1/1970 " + time + "";
      var hey = new Date(dateS);
      return hey.getMinutes() + hey.getHours() * 60;
    }
    function minuteToS(time){
      var h = Math.floor(time/60);
      var m = Math.floor(time%60);
      return (h<10?'0'+h:h)+':'+(m<10?'0'+m:m);
    }

    function deleteCot() {
      var defer = $q.defer();
      var promisesDeleteSteps = [];

      for(var i in currentCot.cot.stepsO){
        promisesDeleteSteps.push(deleteWithoutUpdate(i));
      }

      $q.all(promisesDeleteSteps).then(function (ok) {
        $http.delete(DB_PATH + "cots/" + currentCot.cot._id).then(function (ok) {
          currentCot.cot = {};
          defer.resolve(ok);
        },function (err) {
          defer.reject(err);
        })
      },function (err) {
        defer.reject(err);
      });
      return defer.promise;
    }

    //CRUD Step
    function createStep() {
      var newStep = {
        name: "Nom step",
        desc: "Default",
        questsO: [],
        quests: []
      };
      cot.stepsO.push(newStep);
    }


    function readStep(keyS) {
      var defer = $q.defer();
      var questP = [];

      var id = currentCot.cot.steps[keyS];

      $http.get(DB_PATH + "steps/" + id).then(function (resp) {
        console.log(resp);
        currentCot.cot.stepsO[keyS] = resp.data;
        currentCot.cot.stepsO[keyS].questsO = [];


        $q.all(questP).then(function (resps) {
          defer.resolve(resps);
        }, function (errors) {
          defer.reject(errors)
        });
      }, function (error) {
        console.log(error);
        defer.reject(error)
      });
      return defer.promise;
    }

    function updateStep() {

    }

    function deleteWithoutUpdate(key) {
      var toDelete = currentCot.cot.stepsO[key];
      currentCot.cot.stepsO[key].questsO = [];
      var defer = $q.defer();

      var promQ = [];

      //supprimer les quetes
      for (var qt in toDelete.quests) {
        var qtO = toDelete.quests[qt];
        promQ.push($http.delete(DB_PATH + "quests/" + qtO));
      }

      $q.all(promQ).then(function (resp) {
        //supprimer l'objet distant
        if (toDelete._id) {
          var index = currentCot.cot.steps.indexOf(toDelete._id);
          if (index != -1) {
            currentCot.cot.steps.splice(index, 1);
          }
          $http.delete(DB_PATH + "steps/" + toDelete._id).then(function (resp) {
            console.log("step deleted");
            currentCot.cot.stepsO.splice(key, 1);

            defer.resolve(resp.data);
          }, function (err, code) {
            console.error(err, code);
            defer.reject(err);
          });
        }
      }, function (err, code) {
        console.error(err, code);
        defer.reject(err);
      });
      return defer.promise;
    }

    function deleteStep(key) {
      deleteWithoutUpdate(key).then(function (ok) {
        updateCot().then(function (resp) {
          console.log('Step deletedans cot updated')
        });
      },function (err) {

      });
    }

    //CRUD Step
    function createQuest(keyS) {
      console.log(keyS);
      var nb = currentCot.cot.stepsO[keyS].questsO.length;
      var newQuest = {
        name: "Quete " + nb,
        desc: "Description de quete" + nb
      };
      console.log(newQuest);
      currentCot.cot.stepsO[keyS].questsO.push(newQuest);
    }

    function readQuest(keyS, keyQ) {

      var defer = $q.defer();

      var id = currentCot.cot.stepsO[keyS].quests[keyQ];

      var poiP = [];

      $http.get(DB_PATH + "quests/" + id).then(function (resp) {
        console.log(keyS + ' ' + keyQ);
        console.dir(currentCot.cot.stepsO[keyS]);
        console.dir(currentCot.cot.stepsO[keyS].questsO);

        currentCot.cot.stepsO[keyS].questsO[keyQ] = resp.data;
        if (resp.data.poi) {
          poiP.push(readPoi(keyS, keyQ));
        }
        if (resp.data.riddle) {
          poiP.push(readRiddle(keyS, keyQ));
        }
        if (poiP.length) {
          $q.all(poiP).then(function (data) {
            defer.resolve(data);
          });
        }
        else {
          defer.resolve(resp.data);
        }
        //readPoi(keyS, keyQ);
      }, function (error) {
        console.log(error);
        defer.reject(error);

      });
      return defer.promise;

    }

    function updateQuest() {

    }

    function deleteQuest(keyS, keyQ) {
      var toDelete = currentCot.cot.stepsO[keyS].questsO[keyQ];

      if (toDelete._id) {
        var index = currentCot.cot.stepsO[keyS].quests.indexOf(toDelete._id);
        if (index != -1) {
          currentCot.cot.stepsO[keyS].quests.splice(index, 1);
        }
        $http.delete(DB_PATH + "quests/" + toDelete._id).then(function (resp) {
          console.log("quest deleted");

        }, function (err, code) {
          console.error(err, code);
        });
      }

      currentCot.cot.stepsO[keyS].questsO.splice(keyQ, 1);
    }

    //CRUD Riddle
    function createRiddle() {
    }

    function readRiddle(keyS, keyQ) {
      /*      var defer = $q.defer();
       defer.resolve(resp.data);
       defer.reject(error);

       return defer.promise;*/
      var defer = $q.defer();

      var id = currentCot.cot.stepsO[keyS].questsO[keyQ].riddle;
      if (!id) {
        defer.reject('Id not found');
        return defer.promise;
      }

      $http.get(DB_PATH + "riddles/" + id).then(function (resp) {

        currentCot.cot.stepsO[keyS].questsO[keyQ].riddleO = resp.data;
        currentCot.cot.stepsO[keyS].questsO[keyQ].riddle_name = resp.data.name;

        defer.resolve(resp.data);
      }, function (error) {
        console.log(error);
        defer.reject(error);

      });

      return defer.promise;

    }

    function updateRiddle() {
    }

    function deleteRiddle() {
    }

    function readPoi(keyS, keyQ) {

      var defer = $q.defer();

      var quest = currentCot.cot.stepsO[keyS].questsO[keyQ];
      if (!quest.poi)
        return;

      $http.get(DB_PATH + "pois/" + quest.poi).then(function (resp) {
        quest.poiO = resp.data;
        if (currentCot.cot.pois.indexOf(resp.data._id) != -1) {
          currentCot.cot.pois.push(poiO);
        }
        defer.resolve(resp.data);

      }, function (error) {
        console.error(error);
        defer.reject(error);

      });
      return defer.promise;
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
      //readQuest: readQuest,
      updateQuest: updateQuest,
      deleteQuest: deleteQuest,

      //CRUD Riddle
      createRiddle: createRiddle,
      readRiddle: readRiddle,
      updateRiddle: updateRiddle,
      deleteRiddle: deleteRiddle
    }
  }]);
