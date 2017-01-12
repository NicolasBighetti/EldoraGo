angular.module('eldoragoApp')
  .controller('PoiListCtrl',['$scope', '$http','$window','$timeout', 'FileUploader', function($scope, $http,$window,$timeout,FileUploader) {

    $scope.btnMsg = "edit";

    $scope.edit = function() {
      $scope.isEdited = true;
    }

    $scope.save = function() {
      // Save en BDD
      $http.put(DB_PATH+"pois/"+$scope.poiSelected._id, $scope.poiSelected).then(function(resp) {
        console.log(resp);
        $scope.isEdited = false;

      }, function(error) {
        alert(error);
      });
    }

    $scope.map = {
      center: {
        latitude: 44,
        longitude: 6
      },
      zoom: 7,
      markers: [],
      events: {
        click: function(map, eventName, originalEventArgs) {
          var e = originalEventArgs[0];
          console.log(e);
          var lat = e.latLng.lat(),
            lon = e.latLng.lng();
        }
      }
    };


    /** Get de la BDD **/
    $http.get(DB_PATH+"pois").then(function(resp) {
      $scope.markerList = resp.data;
      console.log($scope.markerList);

      // foreach marker on markerList BDD
      for (var i = 0; i < $scope.markerList.length; i++) {
        //rename _id en id
        $scope.markerList[i].id = $scope.markerList[i]._id;
        // adding marker on the map
        $scope.map.markers.push($scope.markerList[i]);
        // console.log($scope.markerList[i]);
      }
      console.log($scope.map.markers);
      // $scope.$apply();

    });

    /** Action Cliquer **/
    $scope.marker = {
      events: {
        click: function(marker, eventName, args) {
          //$('#interestMarker').modal('show');
          //$scope.open();
          //console.log(marker.position.lat() +" -- "+ marker.position.lng());
          console.log("Marker clicked ! ");
          console.log("$scope.markerList.length"+ $scope.markerList.length)

          for (var i = 0; i < $scope.markerList.length ; i++) {
            if ($scope.markerList[i].id === marker.key) {
              $scope.poiSelected = $scope.markerList[i];
              $scope.uploader.url = DB_PATH + 'pois/picture/' + $scope.poiSelected._id;

            }
          }
          console.log($scope.poiSelected);
        }
      }
    };


    /*** BDD Mocked ***/
   /* $scope.listPois = [{
      name: "Monument : La sculpture de Louis XIV",
      image: "../images/louis_xiv.jpg",
      desc: "Cette statue équestre de Louis XIV est une statue équestre en bronze de Louis XIV située sur la place d'Armes devant le château de Versailles. Jusqu'en 2008-2009, elle se trouvait dans la cour d'Honneur."
    }];*/

    /*** Poi picture upload ***/
    if($scope.poiSelected) {
      $scope.imageURL = $scope.poiSelected.image;
    }
    
    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/pois/picture/',
      alias: 'newPoiPicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the poi selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the poi has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate poi object
      $scope.poiSelected = response;

      console.log('success');
      console.dir(response);
      console.dir(fileItem);
      
      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the poi has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change poi profile picture
    $scope.uploadPoiPicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      console.log('uploading ...');
      console.dir($scope.uploader.getNotUploadedItems()[0]);
      console.log(' to ' +$scope.uploader.url);
      
      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.poiSelected.image;
    };
  }]);
