(function () {
  'use strict';

  describe('Timelines Controller Tests', function () {
    // Initialize global variables
    var TimelinesController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      TimelinesService,
      mockTimeline;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _TimelinesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      TimelinesService = _TimelinesService_;

      // create mock Timeline
      mockTimeline = new TimelinesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Timeline Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Timelines controller.
      TimelinesController = $controller('TimelinesController as vm', {
        $scope: $scope,
        timelineResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleTimelinePostData;

      beforeEach(function () {
        // Create a sample Timeline object
        sampleTimelinePostData = new TimelinesService({
          name: 'Timeline Name'
        });

        $scope.vm.timeline = sampleTimelinePostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (TimelinesService) {
        // Set POST response
        $httpBackend.expectPOST('api/timelines', sampleTimelinePostData).respond(mockTimeline);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Timeline was created
        expect($state.go).toHaveBeenCalledWith('timelines.view', {
          timelineId: mockTimeline._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/timelines', sampleTimelinePostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Timeline in $scope
        $scope.vm.timeline = mockTimeline;
      });

      it('should update a valid Timeline', inject(function (TimelinesService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/timelines\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('timelines.view', {
          timelineId: mockTimeline._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (TimelinesService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/timelines\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Timelines
        $scope.vm.timeline = mockTimeline;
      });

      it('should delete the Timeline and redirect to Timelines', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/timelines\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('timelines.list');
      });

      it('should should not delete the Timeline and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
