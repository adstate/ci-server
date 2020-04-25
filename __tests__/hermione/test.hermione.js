require('dotenv').config();
const assert = require('assert');
const {deleteSettings} = require('../../server/src/core/ci-api');

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
      .keys([config.repoName], '\uE007')
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
      .assertView('settingsFormSaving', '.setting-form__footer')
    });

    it('Проверка создания билда для последнего коммита', function() {
      this.browser.pause(3000); //ожидание клонирования репозитория

      return this.browser
        .url('/')
        .waitForExist('.section')
        .isExisting('.build')
        .then((exists) => {
          assert.ok(exists, 'Билд не создан или не загружен');
        });
    });

    it('Проверка добавления билда', function() {
      return this.browser
        .url('/')
        .waitForExist('.section')
        .click('.header__button-group button:first-child')
        .waitForExist('.new-build')
        .then((exists) => {
          assert.ok(exists, 'Окна добавления коммита не появилось');
        })
        .assertView('newBuildDialog', '.new-build')
        .click('.new-build input[name="commitHash"')
        .keys(['de54649'], '\uE007')
        .click('.setting-form__submit')
        .pause(2000)
        .click('.build')
        .pause(1000)
        .isExisting('.build_view_details')
        .then((exists) => {
          assert.ok(exists, 'Страница билда не открылась');
        })
    });

}); 
