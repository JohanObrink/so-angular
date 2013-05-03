module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    // Concats the js files into a single include
    concat: {
      options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'public/js/<%= pkg.name %>.js'
      }
    },

    // Jshints the src files
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        },
      },
      beforeconcat: ['src/**/*.js'],
      afterconcat: ['public/js/<%= pkg.name %>.js']
    },

    // Runs mocha tests in phantomjs
    mocha: {
      all: {
        src: [ 'test/**/*.html' ],
        options: {
          reporter: 'Spec'
        }
      }
    },

    less: {
      development: {
        options: {
          paths: ["less"]
        },
        files: {
          "public/css/<%= pkg.name %>.css": "less/main.less"
        }
      },
      production: {
        options: {
          paths: ["less"],
          yuicompress: true
        },
        files: {
          "public/css/<%= pkg.name %>.min.css": "less/main.less"
        }
      }
    },

    // Watches files to trigger tasks
    regarde: {
      less: {
        files: ['less/*.less'],
        tasks: ['less'],
        spawn: true
      },
      js: {
        files: 'src/**/*.js',
        tasks: ['concat', 'jshint', 'mocha'],
        spawn: true
      },
      test: {
        files: ['test/**/*.html', 'test/spec/**/*.js'],
        tasks: ['mocha'],
        spawn: true
      }
    }


  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-regarde');

  // Default task(s).
  grunt.registerTask('default', ['less', 'concat', 'jshint', 'mocha', 'regarde']);

};