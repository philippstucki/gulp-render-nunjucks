var gutil = require('gulp-util');
var assert = require('assert');
var nunjucksRender = require('..');


describe('gulp-render-nunjucks tests', function() {
  it('should read options', function(done) {
    var stream = nunjucksRender({
      defaultTemplate: 'foo',
      templatePath: 'test/templates'
    });
    var file = new gutil.File({
      base: 'test/fixtures',
      cwd: 'test/',
      path: 'test/fixtures/tmpl.html',
      contents: new Buffer('foo')
    });
    stream.once('data', function(newFile){
      assert(newFile);
      assert(newFile.contents);
      done();
    });
    stream.write(file);
  });
})