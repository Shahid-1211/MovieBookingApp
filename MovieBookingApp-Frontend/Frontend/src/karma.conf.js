module.exports = function (config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-jasmine-html-reporter'),
        require('karma-coverage-istanbul-reporter'),
        require('@angular-devkit/build-angular/plugins/karma')
      ],
      client: {
        clearContext: false,
        jasmine: {
          verboseDeprecations: true,
        }
      },
      coverageIstanbulReporter: {
        dir: require('path').join(__dirname, '../coverage'),
        reports: ['html', 'lcovonly', 'text-summary'],
        fixWebpackSourcePaths: true
      },
      reporters: ['progress', 'kjhtml', 'coverage-istanbul'],
      port: 4200,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: ['CustomHeadlessChrome'],
      customLaunchers: {
        CustomHeadlessChrome: {
          base: 'Chrome',
          flags: [
            '--disable-gpu',
            '--no-sandbox',
            '--disable-web-security'
          ]
        }
      },
      singleRun: false,
      restartOnFileChange: true,
      captureTimeout: 600000,
      browserDisconnectTimeout: 600000,
      browserNoActivityTimeout: 600000,
      browserDisconnectTolerance: 1
    });
  };
  