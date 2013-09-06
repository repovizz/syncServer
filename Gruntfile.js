/*
 * Advanced Grunt file
 * Requires matchdep and async to be installed
 *
 */

module.exports = function(grunt) {

  // Some of the configuration is loaded from external files

  var requirejs = grunt.file.readJSON('config/r.json');
  requirejs.baseUrl = 'client';

  grunt.initConfig({
    requirejs: requirejs,
    bower: {
      target: {
          rjsConfig: 'client/js/main'
      }
    },
    'amd-test': {
      mode: 'qunit',
      files: 'test/unit/**/*.js'
    }
  });

  // Load all tasks listed as dependencies
  require('matchdep')
    .filterDev('grunt-*')
    .forEach(grunt.loadNpmTasks);

  // Define some custom tasks and bundles

  grunt.registerTask('build', [
    'bower',
    'amd-doc',
    'amd-test'
  ]);


};