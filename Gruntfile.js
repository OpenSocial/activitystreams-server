module.exports = function(grunt) {

    // Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        concat: {
            dist: {
                src: [
                    "public/javascripts/**/*.js"
                ],
                dest: "dist/js/production.js"
            }
        },

        cssmin: {
            minify: {
                expand: true,
                cwd: "dist/css/",
                src: ["public/stylesheets/**/*.css"],
                dest: "dist/css/",
                ext: ".min.css"
            }
        },

        jshint: {
            files: ["gruntfile.js", "public/javascripts/**/*.js"],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
        
        uglify: {
            build: {
                src: "dist/js/production.js",
                dest: "dist/js/production.min.js"
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
                files: ["public/stylesheets/**/*.css"],
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