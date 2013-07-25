module.exports = function(grunt) {

  grunt.initConfig({
    requirejs: grunt.file.readJSON('client/config.json'),
    bower: {
      target: {
          rjsConfig: 'client/config.json'
      }
    }
  });

  grunt.loadNpmTasks('grunt-amd-doc');
  grunt.loadNpmTasks('grunt-bower-requirejs');
  grunt.loadNpmTasks('grunt-amd-test');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('build', [
    'bower',
    'amd-doc',
    'amd-test'
  ]);

  grunt.registerTask('install',
    'Install Bower and NPM dependencies', function() {
      var exec = require('child_process').exec;
      var cb = this.async();
      exec('npm install',function(){
        exec('bower Install', function(){
          cb();
        });
      });
    });

};