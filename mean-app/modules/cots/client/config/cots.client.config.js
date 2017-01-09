(function () {
  'use strict';

  angular
    .module('cots')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Cots',
      state: 'cots',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'cots', {
      title: 'List Cots',
      state: 'cots.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'cots', {
      title: 'Create Cot',
      state: 'cots.create',
      roles: ['user']
    });
  }
}());
