'use strict';

describe('Cot instances E2E Tests:', function () {
  describe('Test Cot instances page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/cot-instances');
      expect(element.all(by.repeater('cot-instance in cot-instances')).count()).toEqual(0);
    });
  });
});
