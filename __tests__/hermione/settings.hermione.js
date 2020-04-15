const assert = require('assert');

const config = {
  repoName: 'adstate/async-hw',
  buildCommand: 'npm run build',
  mainBranch: 'master',
  period: '20'
}

describe('Проверка интерфейса', () => {
  it('Открывается страница настроек', function() {
    return this.browser
      .url('/settings')
      .waitForExist('.section')
      .isExisting('.setting-form')
      .then((exists) => {
        assert.ok(exists, 'Страница настроек не открылась');
      })
      .clearElement('.setting-form input[name="repoName"]')
      .clearElement('.setting-form input[name="buildCommand"]')
      .clearElement('.setting-form input[name="mainBranch"]')
      .clearElement('.setting-form input[name="period"]')
      .assertView('settingsPage', 'body')
  });

  it('Сохранение настроек', function() {
    return this.browser
      .url('/settings')
      .waitForExist('.setting-form')
      .clearElement('.setting-form input[name="repoName"]')
      .click('.setting-form input[name="repoName"]')
      .keys([config.repoName])
      .clearElement('.setting-form input[name="buildCommand"]')
      .click('.setting-form input[name="buildCommand"]')
      .keys([config.buildCommand], '\uE007')
      .clearElement('.setting-form input[name="mainBranch"]')
      .click('.setting-form input[name="mainBranch"]')
      .keys([config.mainBranch], '\uE007')
      .clearElement('.setting-form input[name="period"]')
      .click('.setting-form input[name="period"]')
      .keys([config.period], '\uE007')
      .click('.setting-form__submit')
      .assertView('settingsFormSaving', 'body')
    });

    it('Проверка создания билда для последнего коммита', function() {
      this.browser.pause(3000); //ожидание клонирования репозитория

      return this.browser
        .url('/')
        .waitForExist('.section')
        .isExisting('.build')
        .then((exists) => {
          assert.ok(exists, 'Билд не создан или не загружен');
        })
    });

    it('Проверка добавления билда', function() {

    });

}); 
