# [gulp](https://github.com/gulpjs/gulp)-render-nunjucks

This plugin renders text content to HTML using templates with support for custom filters and tags.

While it should work for many scenarios, it's decent element if you want to convert Markdown files to HTML.

By using [gulp-front-matter](), [gulp-markdown]() and this plugin in a single task, you get a basic static page generator.

## Sample task

``` js

var gulp = require('gulp');
var path = require('path');
var markdown = require('gulp-markdown');
var frontMatter = require('gulp-front-matter');
var nunjucks = require('gulp-render-nunjucks');

gulp.task('render', function() {

	// Grab a few Markdown files
	gulp.src(['content/**/*.md'])
		// Extract and strip front matter via gulp-front-matter
		// and write it to file.meta
		.pipe(frontMatter({
			property: 'meta',
			remove: true
		}))
		// convert the remaining file.contents to Markdown
		.pipe(markdown())

		// Use the extracted front-matter to enhance
		// the nunjucks rendering context
		.pipe(nunjucks({
			property: 'meta',

			// load Nunjucks plugins from a folder
			// named "plugins" in the current directory
			pluginDirectory: path.join(__dirname, 'plugins')
		}))
		.pipe(gulp.dest('output'));
}

```

## Options

### templatePath

Defaults to `./templates` from the gulpfile directory

### templateExtension

Defaults to `.html`

### defaultTemplate

Defaults to `base`. This template is used unless a different template is specified inside the object adressed by the `property` option. This can be used with Markdown Extended file to override the template in the front matter.

### nunjucksConfig

An object literal defining the settings for Nunjucks. Disables autoescape by default as we are in a (hopefully) sane environment.

### pluginDirectory

Default is empty. To add plugins to Nunjucks (which is really awesome and should give you powerful options to extend the whole thing), specify a path. My suggestion is `path.join(__dirname, 'plugins')`

### property

Defaults to `meta`. This is a key of the currently handled file piped by Gulp. Useful if another plugin like front-matter attached some additional information there.


----

That's it for now. This is a first and rather rough draft. It's only based on buffers currently, which is rather shameful. It would be sweet, if someone could help me converting this plugin to streams.

Cheers,
Florian - [@pichfl](http://twitter.com/pichfl)

----

The plugin is provided as is. Merge requests with fixes and improvements are highly encuraged.
