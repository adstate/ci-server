const assert = require('assert');

describe('Тесты отображение', () => {
  it('Если настройки не заданы, по корневому адресу должна открываться Start Page', function() {
    return this.browser
      .url('/')
      .pause(1000)
      .waitForExist('#startPage')
      .then((exists) => {
        assert.ok(exists, 'Стартовая страница не открылась');
      })
      .assertView('startPage', 'body', { screenshotDelay: 10 })
  });
});