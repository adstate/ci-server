module.exports = {
    baseUrl: 'http://localhost:3000',
    gridUrl: 'http://0.0.0.0:4444/wd/hub',
    screenshotsDir: './__tests__/hermione/screens',
    strictTestsOrder: true,
    retry: 2,
    browsers: {
      chrome: {
        desiredCapabilities: {
          browserName: 'chrome',
        },
        compositeImage: true,
        waitTimeout: 10000
      },
    },
    plugins: {
      'html-reporter/hermione': {
        path: '__tests__/hermione/hermione-html-reporter',
      }
    },
  };