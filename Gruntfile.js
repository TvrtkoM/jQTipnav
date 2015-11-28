module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    watch: {
      js: {
        options: {
          interrupt: true
        },
        files: ['es2015-src/*'],
        tasks: ['babel:build']
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.js',
        browsers: ['Firefox']
      },
      dev: {
        reporters: 'dots'
      }
    },
    lodash: {
      build: {
        dest: 'vendor/lodash.js',
        options: {
          category: ['collection', 'function']
        }
      }
    },
    babel: {
      build: {
        options: {
          presets: 'es2015'
        },
        files: [{
          expand: true,
          cwd: 'es2015-src',
          src: ['*'],
          dest: 'js-compiled',
          ext: '.es6-compiled.js'
        }]
      }
    },
    uglify: {
      options: {
        mangle: true
      },
      jqtipnav: {
        files: {
          'build/jqtipnav.min.js': ['js-compiled/jqtipnav.es6-compiled.js']
        }
      }
    },
    cssmin: {
      target: {
        files: {
          'build/jqtipnav.min.css': ['stylesheets/style.css']
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-lodash');
  grunt.registerTask('build-bin', ['uglify:jqtipnav']);
  grunt.registerTask('build-dev', ['lodash']);
  grunt.registerTask('build', ['babel', 'uglify:jqtipnav', 'cssmin']);
};