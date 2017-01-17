'use strict';

//angular.module('eldoragoApp').controller('ChangePoiPictureController', ['$scope', '$timeout', '$window', 'FileUploader',
angular.module('eldoragoApp')
  .controller('ChangePoiPictureController',
  function ($scope, $timeout, $window, FileUploader) {
    //$scope.user = Authentication.user;
    $scope.imageURL = $scope.poi.image;

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/poi/picture',
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

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.poiSelected.image;
    };
  }
);
