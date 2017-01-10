angular.module('eldoragoApp')
  .factory('CotFactory', function() {
    var currentCot;

    return {
      getCurrentCot: function() {
        return currentCot;
      },

      setCurrentCot: function(cot) {
        currentCot = cot;
      }
    }
  });
