'use strict';

describe('Cots E2E Tests:', function () {
  describe('Test Cots page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/cots');
      expect(element.all(by.repeater('cot in cots')).count()).toEqual(0);
    });
  });
});
