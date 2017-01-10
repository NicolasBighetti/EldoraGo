(function () {
  'use strict';

  describe('Timelines Route Tests', function () {
    // Initialize global variables
    var $scope,
      TimelinesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TimelinesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TimelinesService = _TimelinesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('timelines');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/timelines');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          TimelinesController,
          mockTimeline;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('timelines.view');
          $templateCache.put('modules/timelines/client/views/view-timeline.client.view.html', '');

          // create mock Timeline
          mockTimeline = new TimelinesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Timeline Name'
          });

          // Initialize Controller
          TimelinesController = $controller('TimelinesController as vm', {
            $scope: $scope,
            timelineResolve: mockTimeline
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:timelineId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.timelineResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            timelineId: 1
          })).toEqual('/timelines/1');
        }));

        it('should attach an Timeline to the controller scope', function () {
          expect($scope.vm.timeline._id).toBe(mockTimeline._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/timelines/client/views/view-timeline.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TimelinesController,
          mockTimeline;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('timelines.create');
          $templateCache.put('modules/timelines/client/views/form-timeline.client.view.html', '');

          // create mock Timeline
          mockTimeline = new TimelinesService();

          // Initialize Controller
          TimelinesController = $controller('TimelinesController as vm', {
            $scope: $scope,
            timelineResolve: mockTimeline
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.timelineResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/timelines/create');
        }));

        it('should attach an Timeline to the controller scope', function () {
          expect($scope.vm.timeline._id).toBe(mockTimeline._id);
          expect($scope.vm.timeline._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/timelines/client/views/form-timeline.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TimelinesController,
          mockTimeline;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('timelines.edit');
          $templateCache.put('modules/timelines/client/views/form-timeline.client.view.html', '');

          // create mock Timeline
          mockTimeline = new TimelinesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Timeline Name'
          });

          // Initialize Controller
          TimelinesController = $controller('TimelinesController as vm', {
            $scope: $scope,
            timelineResolve: mockTimeline
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:timelineId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.timelineResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            timelineId: 1
          })).toEqual('/timelines/1/edit');
        }));

        it('should attach an Timeline to the controller scope', function () {
          expect($scope.vm.timeline._id).toBe(mockTimeline._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/timelines/client/views/form-timeline.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
