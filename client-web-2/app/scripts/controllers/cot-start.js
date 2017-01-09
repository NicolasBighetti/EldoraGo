 

angular.module('eldoragoApp')
  .controller('CotStartCtrl', function ($scope, $location) {
      $scope.TreatAdress = function (lien) {
          console.log("Le LIEN : " + lien);

          var geocoder = new google.maps.Geocoder();
          geocoder.geocode({ "address": lien }, function (results, status) {
              if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
                  var location = results[0].geometry.location;
                  console.log("LOCATION in the cot-start controller: " + location);
                  //$scope.lat = location.lat();
                  //$scope.lon = location.lng();
                  $scope.updateLocation(location.lat(), location.lng());

                 // $location.path("/#!/cot-step");

              }
          })
      };
      
  });