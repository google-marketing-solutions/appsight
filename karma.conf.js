/**
 * Karam configuration for running Jasmine tests
 * @param {*} config
 */

module.exports = function (config) {
  config.set({
    basePath: process.cwd(), //'.',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
      },
    },
    jasmineHtmlReporter: {
      suppressAll: true
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/appsight'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome'],
    restartOnFileChange: true,
    files: [
      { pattern: 'src/app/services/log-service.golden-*.*', included: false, served: true, watched: true },
      { pattern: 'src/app/services/*.spec.ts', included: true, watched: true, type: 'module' },
    ]
  });
};
