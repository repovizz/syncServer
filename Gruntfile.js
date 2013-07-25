module.exports = function(grunt) {

  grunt.initConfig({
    requirejs: grunt.file.readJSON('client/r.json'),
    bower: {
      target: {
          rjsConfig: 'client/r.json'
      }
    }
  });

require('matchdep')
  .filterDev('grunt-*')
  .forEach(grunt.loadNpmTasks);

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