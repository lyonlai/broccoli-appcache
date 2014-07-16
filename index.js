/**
 * AppCache file generator for broccoli.
 * It can generate the manifest file base on the tree from the previous
 * Created by lyonlai1984 on 15/07/2014.
 */
var Writer = require('broccoli-writer'),
  walk = require('walk'),
  path = require('path'),
  RSVP = require('rsvp'),
  uuid = require('uuid'),
  _ = require('lodash'),
  os = require('os'),
  fs = require('fs'),
  mergeTrees = require('broccoli-merge-trees');

AppCache.prototype = Object.create(Writer.prototype);
AppCache.prototype.constructor = AppCache;
AppCache.defaultOptions = {
  cache: [], //additional entries in cache section in the manifest file.
  network: [], //entries for the network section in the manifest file.
  fallback: [], //entries for the fallback section in the manifest file.
  settings: [], //entries for the settings section in the manifest file.
  version: uuid.v4, //function to generate the version.
  comment: '', //extra comment section will be located at right after the version section
  manifestFileName: 'app'
};

function AppCache (inputTrees, opts) {
  if (!(this instanceof AppCache)){
    return new AppCache(inputTrees, opts);
  }

  this.options = _.merge(AppCache.defaultOptions, opts);
  this.inputTree = _.isArray(inputTrees) ? mergeTrees(inputTrees) : inputTrees;
};

AppCache.prototype.write = function (readTree, destDir) {

  var deferred = RSVP.defer(),
      promise = deferred.promise,
      that = this;

  if(this.inputTree){
    readTree(this.inputTree).then(function(src){
      var cacheEntries = [];

      walk.walkSync(src, {
        listeners: {
          file: function (root, fileStats, next) {
            cacheEntries.push(path.join(root.replace(src, ''), fileStats.name));
            next();
          }
        }
      });


      deferred.resolve(cacheEntries);
    });
  } else {
    deferred.resolve([]);
  }

  return promise.then(function(cacheEntries) {
    var manifestContent = that.composeAppCacheManifest(cacheEntries);
        manifestFileName = path.join(destDir, that.options.manifestFileName || 'app') + ".manifest";

    return fs.writeFileSync(manifestFileName, manifestContent, { encoding: 'utf8' });
  });
};

AppCache.prototype.composeAppCacheManifest = function(collectedCacheEntries){
  var caches = collectedCacheEntries.concat(this.options.cache),
      items = [],
      options = this.options;

  items.push('CACHE MANIFEST');

  _.each(AppCache.sectionOrders, function(section) {
    switch(section) {
      case 'version':
        items.push('#version: ' + (_.isFunction(options.version) ? (options.version)() : uuid.v4()));
        break;
      case 'comment':
        if(!_.isEmpty(options.comment)){
          var lines = options.comment.split("\n");
          _.each(lines, function(line) { items.push('#' + line.trim()); });
          break;
        }
      case 'cache':
        items.push(section.toUpperCase());
        _.each(caches, function(item) {items.push(item)});
        break;
      case 'network':
      case 'fallback':
      case 'settings':
        items.push(section.toUpperCase());
        _.each(options[section], function(item) {items.push(item)});
        break;
    }
  });

  return items.join("\n");
};

AppCache.sectionOrders = [ 'version', 'comment', 'cache', 'network', 'fallback', 'settings'];

module.exports = AppCache;