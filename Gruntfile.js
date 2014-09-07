'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/{,*/}*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'
var bodyParser = require('body-parser');

module.exports = function(grunt) {

  //jit-grunt loads only the npm tasks required for the grunt task.
  //makes livereload much faster.
  require('jit-grunt')(grunt, {
    replace: 'grunt-text-replace',
    handlebars: 'grunt-contrib-handlebars'
  });

    // Project configuration.
  grunt.initConfig({
    watch: {
      js: {
        files: ['./public/**/*.js'],
        tasks: ['jshint']
      }
    },
    connect: {
      server: {
        options: {
          port: 3000,
          base: 'public',
          middleware: function(connect, options, middlwares) {
            // an explicit array of any middlewares that ignores the default set
            return [
              connect()
                .use(bodyParser.urlencoded({
                              extended: true
                            })),
                //.use(bodyParser.json()),
              
              connect.static(options.base[0]),

              function(req, res, next) {
                if(req.method === 'POST'){
                  if (req.url === '/api'){
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    grunt.file.write('req.log', JSON.stringify(req.body));
                    res.end(grunt.file.read('req.log'));
                  } else {
                    return next();
                  }
                } else {
                  next();
                }              
              }
            ];
          },
        },
      }
    },
    jshint: {
      options: {
        browser: true,
        devel: true,
        trailing: true,
        curly: true,
        eqeqeq: true,
        indent: 4,
        latedef: true,
        noempty: true,
        nonbsp: true,
        undef: true,
        quotmark: 'single',
        '-W087': true       
      },
      files: {
        src: ['./public/**/*.js']
      }
    }
  });

  grunt.registerTask('default', [
    'jshint',
    'connect',
    'watch'
  ]);

}
