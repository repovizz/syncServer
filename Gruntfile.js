/*
 * Advanced Grunt file
 * Requires matchdep and async to be installed
 *
 */

module.exports = function(grunt) {

  // Some of the configuration is loaded from external files

  var requirejs = grunt.file.readJSON('shared/r.json');
  requirejs.baseUrl = 'client';

  grunt.initConfig({
    requirejs: requirejs,
    bower: {
      target: {
          rjsConfig: 'client/r.js'
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

  grunt.registerTask('update',
    'Force update all dependencies to the lastest version',
    function () {
      var exec = require('child_process').exec;
      var async = require('async');
      var cb = this.async();
      var deps = grunt.file.readJSON('dependencies.json');
      var commands = [].concat(
        deps.server.production.map(function(dep) {
          return 'npm install ' + dep + ' --save';
        }),
        deps.server.development.map(function(dep) {
          return 'npm install ' + dep + ' --save-dev';
        }),
        deps.client.production.map(function(dep) {
          return 'bower install ' + dep + ' --save';
        }),
        deps.client.development.map(function(dep) {
          return 'bower install ' + dep + ' --save-dev';
        })
      );
      async.map(commands, exec, cb);
    });

};