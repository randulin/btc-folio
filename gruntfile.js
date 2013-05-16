module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: ['public/js/filters/numbere.js', 'public/js/main.js'],
        dest: 'public/js/main.min.js'
      }
    }
    , concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['public/js/angular.min.js', 'public/js/main.min.js'],
        dest: 'public/js/app.js'
      }
    }
    , cssmin: {
        combine: {
          files: {
            'public/css/app.css': ['public/css/normalize.css', 'public/css/main.css' ]
          }
        }
      }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'cssmin', 'concat']);

};