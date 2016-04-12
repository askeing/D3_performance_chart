module.exports = function (grunt) {
    grunt.initConfig({
        'clean': {
            dest: ['dest'],
            min_js: ['js/performance_chart.min.js', 'js/main.min.js'],
            min_css: ['css/main.min.css']
        },
        'uglify': {
            javascript_files: {
                files: {
                    'js/performance_chart.min.js': ['src/js/performance_chart.js'],
                    'dest/js/performance_chart.min.js': ['src/js/performance_chart.js'],
                    'js/main.min.js': ['src/js/main.js'],
                    'dest/js/main.min.js': ['src/js/main.js']
                }
            }
        },
        'cssmin': {
            css_files: {
                files: {
                    'css/main.min.css': ['src/css/main.css'],
                    'dest/css/main.min.css': ['src/css/main.css']
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['clean', 'uglify', 'cssmin']);
};
