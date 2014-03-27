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
    }
  });
  
  grunt.registerTask("default", "build");
  
  grunt.registerTask("build", ["revision", "clean:build", "sass:build", "committers", "markdown:all"]);
  
  grunt.registerTask("publish", ["build", "buildcontrol:deploy"]);
};