(function () {
  'use strict';

  describe('Cots Route Tests', function () {
    // Initialize global variables
    var $scope,
      CotsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CotsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CotsService = _CotsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('cots');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/cots');
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
          CotsController,
          mockCot;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('cots.view');
          $templateCache.put('modules/cots/client/views/view-cot.client.view.html', '');

          // create mock Cot
          mockCot = new CotsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Cot Name'
          });

          // Initialize Controller
          CotsController = $controller('CotsController as vm', {
            $scope: $scope,
            cotResolve: mockCot
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:cotId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.cotResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            cotId: 1
          })).toEqual('/cots/1');
        }));

        it('should attach an Cot to the controller scope', function () {
          expect($scope.vm.cot._id).toBe(mockCot._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/cots/client/views/view-cot.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CotsController,
          mockCot;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('cots.create');
          $templateCache.put('modules/cots/client/views/form-cot.client.view.html', '');

          // create mock Cot
          mockCot = new CotsService();

          // Initialize Controller
          CotsController = $controller('CotsController as vm', {
            $scope: $scope,
            cotResolve: mockCot
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.cotResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/cots/create');
        }));

        it('should attach an Cot to the controller scope', function () {
          expect($scope.vm.cot._id).toBe(mockCot._id);
          expect($scope.vm.cot._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/cots/client/views/form-cot.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CotsController,
          mockCot;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('cots.edit');
          $templateCache.put('modules/cots/client/views/form-cot.client.view.html', '');

          // create mock Cot
          mockCot = new CotsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Cot Name'
          });

          // Initialize Controller
          CotsController = $controller('CotsController as vm', {
            $scope: $scope,
            cotResolve: mockCot
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:cotId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.cotResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            cotId: 1
          })).toEqual('/cots/1/edit');
        }));

        it('should attach an Cot to the controller scope', function () {
          expect($scope.vm.cot._id).toBe(mockCot._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/cots/client/views/form-cot.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
