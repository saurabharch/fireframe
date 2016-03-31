/* Image uploading to AWS S3 */
var AWS = require('aws-sdk');
var path = require('path');
var Promise = require('bluebird');
var env = require('../../env');

AWS.config.update(env.AWS);

var image = {};

image.upload = function(id, imageData) {
	var params = {
		Bucket: 'capstone.bucket', 
		Key: id + '.png',
		Body: imageData,
		ContentType: 'image/png',
		ACL: 'public-read'
	};

	var s3 = new Promise.promisifyAll(new AWS.S3());

	//Upload image and return its AWS S3 url
	return s3.uploadAsync(params)
	.then(function(data){
		var imageUrl = data.Location;
		console.log('imageUrl', imageUrl);
		return imageUrl;
	});

};


module.exports = image;
