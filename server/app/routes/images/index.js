var AWS = require('aws-sdk');
var path = require('path');

AWS.config.loadFromPath(path.join(__dirname, '../../../secret/config.json'));

var image = {};
var s3 = new AWS.S3();

image.upload = function(id, photo) {

	var params = {
		Bucket: 'capstone.bucket', 
		Key: id, 
		Body: photo,
		ContentEncoding: 'base64',
		ContentType: 'image/png'
	};

	s3.upload(params, function() {
		console.log('Successfully uploaded photo');
	});
	
};

image.getUrl = function(id) {
	var params = {Bucket: 'capstone.bucket', Key: id};
	var u;
	s3.getSignedUrl('getObject', params, function(err, url) {
		u = url;
		// console.log('The url is', url);
	});

	return u;
};


module.exports = image;
