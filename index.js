'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var _ = require('lodash');
var nunjucks = require('nunjucks');
var path = require('path');
var fs = require('fs');

// Constants
var PLUGIN_NAME = 'gulp-nunjucks';
var PLUGINS_DIR = 'plugins';

module.exports = function (options) {
	options = _.extend({
		templatePath: 'templates',
		templateExtension: '.html',
		defaultTemplate: 'base',
		nunjucksConfig: {
			autoescape: false
		},
		pluginDirectory: 'plugins',
		property: 'meta'
	}, options || {});

	// Configure Nunjucks
	var nj = new nunjucks.Environment(
		new nunjucks.FileSystemLoader(options.templatePath),
		options.nunjucksConfig);

	// Load plugins
	_.each(fs.readdirSync(PLUGINS_DIR), function(file) {
		var plugin = file.match(/^(filter|tag)-(.*)(?:.js$)/);
		var type = plugin[1];
		var name = plugin[2];
		var fn = require(path.join(options.pluginDirectory, file));

		if (type === 'filter') {
			nj.addFilter(name, fn);
		}
		if (type === 'tag') {
			nj.addExtension(name, fn);
		}
	});

	return through.obj(function(file, enc, callback) {
		if (file.isNull()) {
			this.push(file); // Do nothing if no contents
			return callback();
		}

		if (file.isStream()) {
			this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported for now.'));
			return callback();
		}

		if (file.isBuffer()) {
			var meta = file[options.property];

			var context = _.extend(
				_.omit(meta, ['nunjucks', 'template']),
				_.omit(file, ['contents','meta','_contents', 'isBuffer', 'isStream', 'isNull', 'isDirectory', 'clone', 'pipe', 'inspect', 'stat']),
				{
					relativeBase: file.base.substring(file.cwd.length),
					filename: file.path.substring(file.base.length),
					content: file.contents.toString()
				});

			var template = meta.template || options.defaultTemplate;
			template =+ options.templateExtension;

			nj.render('base.html', context, function(error, result) {
				if (error) {
					this.emit(
						'error',
						new PluginError(PLUGIN_NAME, error));
				}

				file.contents = new Buffer(result);
				file.path = gutil.replaceExtension(file.path, '.html');

				this.push(file);
				return callback();
			}.bind(this));
		}
	});
};
