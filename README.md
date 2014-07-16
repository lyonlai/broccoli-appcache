broccoli-appcache
=================

broccoli-appcache generates HTML5 application cache manifest file for broccoli.

*** Usage *** 

var appcache = require('broccoli-appcache');

return appcache([tree1, tree2], options);

appcache can pickup the CACHE section from  it's first argument, which can be an array or a single broccoli tree. The array of trees will be merge inside using broccoli-merge-trees. 

*** Opitons ***

	{
  		cache: [], //additional entries in cache section in the manifest file.
		network: [], //entries for the network section in the manifest file.
		fallback: [], //entries for the fallback section in the manifest file.
		settings: [], //entries for the settings section in the manifest file.
		version: uuid.v4, //function to generate the version.
		comment: '', //extra comment section will be located at right after the version section
		manifestFileName: 'app'
	};
	
cache, networ, fallback, & settings section allow you to add your own entreis.

version is the function that will generate a new version number on the next broccoli build.

manifestFileName will define the prefix of a manifest file name, for example. the default one will be app.manifest. The suffix is chosen because node-mime will know it is text/cache-manifest. When referring to the file, you can put  <html manifest="/app.manifest"> into your index.html.


