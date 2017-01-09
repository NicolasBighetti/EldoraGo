'use strict';

describe('Timelines E2E Tests:', function () {
  describe('Test Timelines page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/timelines');
      expect(element.all(by.repeater('timeline in timelines')).count()).toEqual(0);
    });
  });
});
