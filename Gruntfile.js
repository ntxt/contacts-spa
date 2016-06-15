module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
          dist: {
                options: {
                    alias: {
                        'country-list': './country-list.js'
                    }
                }
            }
        },
        concat: {
            options: {
              separator: ';',
            },
            dist: {
              src: ['src/js/lib/*.js', 'src/js/*.js', 'src/main.js'],
              dest: 'public/app.js',
            },
        },
        copy: {
            dist: {
                expand: true,
                cwd: 'src',
                src: '**',
                dest: 'public/'
            }
        },
        sass: { 
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {  
                    'public/main.css': 'src/sass/main.sass'
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        watch: {
          scripts: {
            files: 'src/**/*.js',
            tasks: ['jshint'],
            options: {
              debounceDelay: 250,
            },
          },
        },
        jshint: {
            all: ['src/**/*.js', '!src/**/country-list-bundle.js', '!src/**/lib/*.js', '!public/**/*.js']
        }
    
    });
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', ['jshint','sass','copy','concat']);
    grunt.registerTask('watch',  ['watch']);
    grunt.registerTask('karma',  ['karma']);
};