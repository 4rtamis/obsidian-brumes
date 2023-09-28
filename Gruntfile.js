/* 
CITY OF MIST OBSIDIAN THEME COMPILER

Heavily based on @kepano's compiler for Minimal (see License below)
See : https://github.com/kepano/obsidian-minimal

----------------------------
MIT License

Copyright (c) 2020-2022 Stephan Ango (@kepano)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
----------------------------
*/

module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		/* Get the user-defined OBSIDIAN_PATH from .env file 
         so that we can live reload the theme in the vault */
		env: {
			local: {
				src: ".env",
			},
		},

		/* Compile the compressed and uncompressed versions of
      the theme using Sass */
		sass: {
			unminified: {
				options: {
					sourcemap: "none",
				},
				files: {
					"src/css/main.css": "src/scss/index.scss",
				},
			},
			dist: {
				options: {
					style: "compressed",
					sourcemap: "none",
				},
				files: {
					"src/css/main.min.css": "src/scss/index.scss",
				},
			},
		},

		/* Minify theme used for distribution and live reload */
		cssmin: {
			options: {
				advanced: false,
				aggressiveMerging: false,
				mediaMerging: false,
				restructuring: false,
			},
			target: {
				files: {
					"src/css/main.min.css": "src/css/main.min.css",
				},
			},
		},

		/* Concatenate theme files adding in the commented license, plugin compatibility, 
         and Style Settings that would otherwise be removed in compression */
		concat_css: {
			dist: {
				files: {
					"theme.css": [
						"src/css/license.css",
						"src/css/main.min.css",
					],
				},
			},
			unminified: {
				files: {
					"Minimal.css": ["src/css/license.css", "src/css/main.css"],
				},
			},
		},

		/* Copy the finished distribution file from the working directory to the vault 
      directory and use correct theme name */
		copy: {
			local: {
				expand: true,
				src: "theme.css",
				dest: process.env.OBSIDIAN_PATH,
				rename: function (dest, src) {
					return dest + "theme.css";
				},
			},
		},

		/* Watch for changes, and compile new changes */
		watch: {
			css: {
				files: ["src/**/*.scss", "src/**/*.css"],
				tasks: [
					"env",
					"sass:unminified",
					"sass:dist",
					"cssmin",
					"concat_css",
					"copy",
				],
			},
		},
	});
	grunt.loadNpmTasks("grunt-env");
	grunt.loadNpmTasks("grunt-contrib-sass");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-concat-css");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.registerTask("loadconst", "Load constants", function () {
		grunt.config("OBSIDIAN_PATH", process.env.OBSIDIAN_PATH);
	});
	grunt.registerTask("default", ["env:local", "loadconst", "watch"]);
};
