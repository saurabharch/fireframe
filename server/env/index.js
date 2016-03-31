var path = require('path');
var devConfigPath = path.join(__dirname, './development.js');
var productionConfigPath = path.join(__dirname, './production.js');

if (process.env.NODE_ENV === 'production') {
    module.exports = require(productionConfigPath);
} else {
	var initialConfig = require(devConfigPath);
	var AWSConfig = require('../secret/config.json');
	initialConfig.AWS = AWSConfig;
    module.exports = initialConfig;
}