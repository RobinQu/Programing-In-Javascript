module.exports = function(grunt) {
  var pkg = grunt.file.readJSON("package.json"),
      build = require("./lib/build");
  
  // Load all avaiable tasks
  require("load-grunt-tasks")(grunt);
  
  // Time how long tasks take. Can help when optimizing build times
  require("time-grunt")(grunt);
  
  grunt.initConfig({
    pkg: pkg,
    
    markdown: {
      all: {
        files: [{
          expand: true,
          src: "**/*.md",
          dest: "dist",
          ext: ".html",
          cwd: "chapters"
        }],
        options: {
          markdownOptions: {
            gfm: true,
            sanitize: false,
            breaks: true,
            smartypants: true
          },
          template: "lib/template/template.html",
          templateContext: {
            buildDate: new Date(),
            revision: "<%= meta.revision %>"
          },
          postCompile: build.postCompile
        }
      }
    },
    
    clean: {
      build: ["dist/**/*"]
    },
    
    sass: {
      build: {
        files: {
          "dist/style.css": "lib/template/scss/style.scss"
        },
        options: {
          imagePath: "lib/template/images"
        }
      }
    },
    
    buildcontrol: {
      deploy: {
        options: {
          dir: "dist",
          commit: true,
          push: true,
          message: "Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%",
          remote: "git@github.com:RobinQu/Programing-In-Javascript.git",
          branch: "gh-pages"
        }
      }
    },
    
    revision: {
      options: {
        property: "meta.revision",
        ref: "HEAD",
        short: true
      }
    },
    
    committers: {
      options: {
        sort: "commits",
        email: true,
        nomerges: true,
        output: "CONTRIBUTORS.md"
      }
    },
    
    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // Change this to "0.0.0.0" to access the server from outside
        hostname: "0.0.0.0"
      },
      preview: {
        options: {
          open: true,
          base: ["dist"],
          livereload: false
        }
      }
    },
    
    gitcommit: {
      contributor: {
        files: {
          src: ["CONTRIBUTORS.md"]
        },
        options: {
          message: "update CONTRIBUTORS.md"
        }
      }
    },
    
    copy: {
      cname: {
        src: "CNAME",
        dest: "dist/CNAME"
      },
      wb: {
        src: "lib/template/wb_07ba57aa1824144c.txt",
        dest: "dist/wb_07ba57aa1824144c.txt"
      }
    }
  });
  
  grunt.registerTask("default", "build");
  
  grunt.registerTask("build", ["revision", "clean:build", "copy:cname", "copy:wb", "sass:build", "committers", "markdown:all"]);
  
  grunt.registerTask("preview", ["build", "connect:preview:keepalive"]);
  
  grunt.registerTask("publish", ["build", "gitcommit:contributor", "buildcontrol:deploy"]);
};