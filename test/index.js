'use strict';

var appcache = require('../index'),
    expect = require('chai').expect,
    root = process.cwd(),
    select = require('broccoli-select'),
    fs = require('fs'),
    broccoli = require('broccoli'),
    builder,
    version,
    _ = require('lodash');

function versioning(){
  return version;
}


describe('broccoli-appcache', function(){
  afterEach(function() {
    if (builder) {
      builder.cleanup();
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
          originalContent = fs.readFileSync(__dirname + '/fixtures/create.manifest', {encoding: 'utf8'}),
          contentArr = content.split("\n"),
          originalContentArray = content.split("\n");

      _.each(contentArr, function(line) { expect(_.contains(originalContentArray, line)).to.be.true; })

    });
  });

  it('should be able to create appcache manifest file with empty comment', function(){
    var tree = appcache(null, {
      cache: [ '/test/a.html', '/b/d.html'],
      network: ['http://www.google.com/'],
      fallback: ['/fallback/c.html'],
      settings: ['prefer-online'],
      version: versioning
    });

    version = 1;

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(dir) {
      var content = fs.readFileSync(dir.directory + '/app.manifest', {encoding: 'utf8'}),
        originalContent = fs.readFileSync(__dirname + '/fixtures/create.empty_comment.manifest', {encoding: 'utf8'}),
        contentArr = content.split("\n"),
        originalContentArray = content.split("\n");

      _.each(contentArr, function(line) { expect(_.contains(originalContentArray, line)).to.be.true; })

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
          originalContent = fs.readFileSync(__dirname + '/fixtures/create_with_tree.manifest', {encoding: 'utf8'}),
          contentArr = content.split("\n"),
          originalContentArray = content.split("\n");

      _.each(contentArr, function(line) { expect(_.contains(originalContentArray, line)).to.be.true; })
    });
  });

  it('should be able to create appcache manifest file within the tree', function(){
    var tree = appcache([select('./test/fixtures/test_trees'), select('./test/fixtures/trees_to_merge')], {
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
          originalContent = fs.readFileSync(__dirname + '/fixtures/create_with_merge_tree.manifest', {encoding: 'utf8'}),
          contentArr = content.split("\n"),
          originalContentArray = content.split("\n");

      _.each(contentArr, function(line) { expect(_.contains(originalContentArray, line)).to.be.true; })
    });
  });
});