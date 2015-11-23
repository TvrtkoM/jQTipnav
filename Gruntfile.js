module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
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
    concat: {
      dist: {
        src: ['js-compiled/container.es6-compiled.js', 'js-compiled/jqtipnav.es6-compiled.js'],
        dest: 'js-compiled/bundle.js'
      }
    },
    uglify: {
      options: {
        mangle: true
      },
      jqtipnav: {
        files: {
          'build/jqtipnav.min.js': ['js-compiled/bundle.js']
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
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-lodash');
  grunt.registerTask('build-bin', ['concat', 'uglify:jqtipnav']);
  grunt.registerTask('build-dev', ['lodash']);
  grunt.registerTask('build', ['babel', 'concat', 'uglify:jqtipnav', 'cssmin']);
};