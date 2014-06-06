module.exports = function(grunt) {

    // Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        concat: {
            login: {
                src: ["public/javascripts/login.js"],
                dest: "public/javascripts/prod/login.prod.js"
            },
            app: {
                src: ["public/javascripts/app*.js"],
                dest: "public/javascripts/prod/app.prod.js"
            }
        },

        cssmin: {
            combine: {
                files: {
                    "public/stylesheets/prod/app.min.css": ["public/stylesheets/*.css"]
                }
            }
        },

        jshint: {
            files: ["gruntfile.js", "public/javascripts/*.js"],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
        
        uglify: {
            login: {
                files: {
                    "public/javascripts/prod/login.prod.min.js": ["public/javascripts/prod/login.prod.js"]
                }
            },
            app: {
                files: {
                    "public/javascripts/prod/app.prod.min.js": ["public/javascripts/prod/app.prod.js"]
                }
            }
        },
        
        watch: {
            scripts: {
                files: ["public/javascripts/**/*.js"],
                tasks: ["jshint", "concat", "uglify"],
                options: {
                    livereload: true,
                    spawn: false
                }
            },
            css: {
                files: ["public/stylesheets/*.css"],
                tasks: ["cssmin"],
                options: {
                    livereload: true,
                    spawn: false
                }
            }
        }
    });

    // Plugins
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");

    // Tasks
    grunt.registerTask("default", ["jshint", "concat", "uglify", "cssmin", "watch"]);
};