/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        calendar_concat: {
            options: {
                banner: '<%= banner %>'
            },
            // Play attention for order of inheritance
            young: {
                src: [
                    "test/deploy/begin.js",
                    "src/main.js",
                    "src/util.js",
                    "src/Event.js",
                    "src/EventManager.js",
                    "src/view/MonthView.js",
                    "src/view/WeekView.js",
                    "src/view/DayView.js",
                    "src/Calendar.js",
                    "test/deploy/end.js"
                ],
                single_files: [
                ],
                dest: {
                    dir: "dist",
                    file: 'calendar-<%= pkg.version %>.js'
                }
            }
        },
        calendar_dev: {
            dev: {
                src: ['src/**.js', 'style/img/**', 'style/css/**'],
                dest: {
                    dir: 'dist_dev'
                }
            }
        },
        watch: {
            all: {
                files: ['src/**', 'style/**', 'test/**', 'demo/**']
            },
            options: {
                livereload: true
            }
        },
        compress: {
            dev: {
                options: {
                    archive: 'dist/calendar_dev_<%= pkg.version %>.zip',
                    mode: 'zip'
                },
                files: [{
                    cwd: 'dist_dev/',
                    expand: true,
                    src: '**',
                    dest: './'
                }]
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            young: {
                files: [{
                    dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js',
                    src: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
                }]
            }
        },
        /**因为scss生成的css已经是压缩过的，所有暂时不需要再使用cssmin，需要保持本地的watch.bat运行正常**/
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            young: {
                files: [{
                    src: "style/css/calendar.css",
                    dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.css'
                }]
            }
        },
         /**因为scss生成的css已经是压缩过的，直接copy**/
        copy: {
            young: {
                files: [{
                    src: "style/css/calendar.css",
                    dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.css'
                }]
            }
        },
        exec: {
            //原则上需要先执行wathc再copy保证代码最新
            sync_css: {
                command: "cd style && start watch.bat && cd ..",
                stdout: true
            }
        },
        replace_mimg_url: {
            young: {
                deploy_mimg: 'http://mimg.127.net/xm/calendar',// /home/coremail/tomcat/host/mimg.127.net/xm/sharkjs
                files: [{
                    src: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.css'
                }]
            }
        }

    });


    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-exec');


    // Default task.
    grunt.registerTask('default', ['deploy_js', 'deploy_css']);
    //
    grunt.registerMultiTask('calendar_concat', 'My "concat" task description.', function(_arg1, _arg2) {
        // console.log(_arg1);return;
        grunt.log.writeln('Currently running the "calendar_concat" task.');
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            separator: grunt.util.linefeed,
            banner: '',
            footer: '',
            process: false
        });

        // Normalize boolean options that accept options objects.
        if (options.stripBanners === true) {
            options.stripBanners = {};
        }
        if (options.process === true) {
            options.process = {};
        }

        // Process banner and footer.
        var banner = grunt.template.process(options.banner);
        var footer = grunt.template.process(options.footer);

        // Iterate over all src-dest file pairs.
        this.files.forEach(function(f) {
            // Concat banner + specified files + footer.
            var src = banner + f.src.filter(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function(filepath) {
                // Read file source.
                var src = grunt.file.read(filepath);
                // Process files as templates if requested.
                if (typeof options.process === 'function') {
                    src = options.process(src, filepath);
                } else if (options.process) {
                    src = grunt.template.process(src, options.process);
                }

                return src;
            }).join(options.separator) + footer;

            var destfile = f.dest.dir + "/" + f.dest.file;
            // Write the destination file.
            grunt.file.write(destfile, src);
            // Print a success message.
            grunt.log.writeln('File "' + destfile + '" created.');
            // copy single_files
            var single_files = f.single_files;

            for (var i = 0; i < single_files.length; i++) {
                var filePath = single_files[i];

                var fileName = filePath.substring(1 + filePath.lastIndexOf("/"));
                grunt.file.copy(filePath, f.dest.dir + "/" + fileName);
                grunt.log.writeln('>>File "' + fileName + '" copied.');
            }
        });
    });
    grunt.registerMultiTask('calendar_dev', 'My "dist" task description.', function(_arg1, _arg2) {
        // console.log(_arg1);return;
        grunt.log.writeln('Currently running the "calendar_dev" task.');
        // Merge task-specific and/or target-specific options with these defaults.

        // Iterate over all src-dest file pairs.
        this.files.forEach(function(f) {
            // Concat banner + specified files + footer.
            var count = 0;
            for (var i = f.src.length - 1; i >= 0; i--) {
                var filePath = f.src[i];
                console.log(filePath)
                if (grunt.file.isFile(filePath)) {
                    grunt.file.copy(filePath, f.dest.dir + "/" + filePath);
                    count++;
                }
            };
            grunt.log.writeln('Total of Copied files : ' + count);
        });

    });
    grunt.registerTask('deploy_js', ['calendar_concat:young', 'uglify:young']);
    grunt.registerTask('deploy_css', ['copy:young']);
    grunt.registerMultiTask('replace_mimg_url', 'deal relative path', function(_arg1, _arg2) {
        var options = this.options({
            separator: grunt.util.linefeed,
            banner: '',
            footer: '',
            process: false
        });
        grunt.log.writeln('Currently running the "replace_mimg_url" task.');
        var oupt = this.data.deploy_dir;
        var mimgURL = this.data.deploy_mimg;
        this.files.forEach(function(f) {
            for (var i = f.src.length - 1; i >= 0; i--) {
                var filePath = f.src[i];
                var src = grunt.file.read(filePath);
                // replace relative path with absolute img url
                if (mimgURL) {
                    src = src.replace(/\.\.\/img/g, mimgURL + '/img');
                }
                grunt.file.delete(filePath);
                // var fileName = filePath.substring(1+filePath.lastIndexOf("/"));
                // if(oupt.endsWith('/')){
                // }else{
                //    oupt = oupt + '/'
                // }
                grunt.file.write(filePath, src);
            };
        });

    });
};
