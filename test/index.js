'use strict';

var appcache = require('../index');
var expect = require('chai').expect;
var root = process.cwd();
var select = require('broccoli-select');

var fs = require('fs');
var broccoli = require('broccoli');

var builder;
var version;

function versioning(){
  return version;
}


describe('broccoli-appcache', function(){
  afterEach(function() {
    if (builder) {
      //builder.cleanup();
    }
  });

  it('should be able to create appcache manifest file', function(){
    var tree = appcache(null, {
      cache: [ '/test/a.html', '/b/d.html'],
      network: ['http://www.google.com/'],
      fallback: ['/fallback/c.html'],
      settings: ['prefer-online'],
      comment: "test",
      version: versioning
    });

    version = 1;

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(dir) {
      var content = fs.readFileSync(dir.directory + '/app.manifest', {encoding: 'utf8'}),
          originalContent = fs.readFileSync(__dirname + '/fixtures/create.manifest', {encoding: 'utf8'});
      expect(content).to.eql(originalContent);
    });
  });

  it('should be able to create appcache manifest file within the tree', function(){
    var tree = appcache(select('./test/fixtures/test_trees'), {
      cache: [ '/test/a.html', '/b/d.html'],
      network: ['http://www.google.com/'],
      fallback: ['/fallback/c.html'],
      settings: ['prefer-online'],
      comment: "test",
      version: versioning
    });

    version = 1;

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(dir) {
      var content = fs.readFileSync(dir.directory + '/app.manifest', {encoding: 'utf8'}),
          originalContent = fs.readFileSync(__dirname + '/fixtures/create_with_tree.manifest', {encoding: 'utf8'});
      expect(content).to.eql(originalContent);
    });
  })
});