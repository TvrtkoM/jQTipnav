var path = require('path');

module.exports = function(grunt) {
  'use strict';

  // copy recursively files from 'src' directory to 'dest' dir under vendor
  var copyToVendor = function(src, dest) {
    grunt.file.recurse(src, function(abs, root, sub, filename) {
      var d = path.join('vendor', dest, sub || '', filename);
      grunt.file.copy(abs, d, {
        process: function(file, src) {
          if(grunt.file.exists(d)) {
            return false;
          }
          grunt.log.writeln('copying: ' + src + ' to ' + d);
          return file;
        }
      });
    });
  };

  grunt.initConfig({
    watch: {
      js: {
        options: {
          interrupt: true
        },
        files: ['es2015-src/*'],
        tasks: ['build-dep', 'babel', 'build-bin', 'karma:dev']
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.js',
        browsers: ['Firefox'],
        singleRun: true
      },
      dev: {
        reporters: 'dots'
      }
    },
    lodash: {
      build: {
        dest: 'vendor/lodash/lodash.js',
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

  // prepares project dependencies - copy jquery and lodash to vendor directory
  grunt.registerTask('build-dep', 'prepare development dependencies', function() {
    if(!grunt.file.exists('vendor/lodash/lodash.js') || !grunt.file.exists('vendor/lodash/lodash.min.js')) {
      grunt.task.run('lodash');
    }

    copyToVendor('node_modules/skeleton-css/css', 'skeleton');
    copyToVendor('node_modules/jquery/dist', 'jquery');
  });

  // build javascript binary in build/ directory
  grunt.registerTask('build-bin', ['babel', 'uglify:jqtipnav']);

  // build all the development and binary files (js & css)
  grunt.registerTask('build', ['build-dep', 'babel', 'uglify:jqtipnav', 'cssmin']);
};