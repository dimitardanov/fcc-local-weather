module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: 'src/js/test',

    // frameworks to use
    frameworks: ['mocha', 'browserify'],

    // preprocessors
    preprocessors: {
      '**/*.js': [ 'browserify', 'coverage' ]
    },

    // list of files / patterns to load in the browser
    files: [
      // vendor files
      // "bower_components/jquery/dist/jquery.js",

      // src files
      // "main.js",

      // test files
      "**/*.test.js"
    ],

    // list of files to exclude
    exclude: [],

    // test results reporter to use
    reporters: ['mocha', 'coverage'],

    mochaReporter: {
      showDiff: true
    },

    coverageReporter: {
      reporters: [
        {
          type: 'text-summary'
        },
        {
          type: 'html',
          dir: '../../../coverage'
        }
      ]
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: [
      // 'Chrome'
      'PhantomJS'
    ],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
