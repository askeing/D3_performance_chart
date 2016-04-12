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
        },
        'copy': {
            d3: {
                expand: true,
                cwd: 'd3',
                src: '**',
                dest: 'dest/d3'
            },
            js: {
                expand: true,
                cwd: 'js',
                src: '**',
                dest: 'dest/js'
            },
            fonts: {
                expand: true,
                cwd: 'css',
                src: '**',
                dest: 'dest/css'
            },
            root: {
                expand: true,
                cwd: '.',
                src: ['index.html', 'data.json'],
                dest: 'dest/'
            },
        },
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['clean', 'uglify', 'cssmin', 'copy']);
};
