/* Image uploading to Amazon S3 */
var AWS = require('aws-sdk');
var path = require('path');

AWS.config.loadFromPath(path.join(__dirname, '../../secret/config.json'));

var image = {};

image.upload = function(id, imageData) {
	var imageUrl;
	var s3 = new AWS.S3({ params: params });
	
	var params = {
		Bucket: 'capstone.bucket', 
		Key: id + '.png',
		Body: imageData,
		ContentType: 'image/png',
		ACL: 'public-read'
	};

	s3.upload(params, function(err, data) {
		if(err) return console.log(err);
		imageUrl = data.Location;
		console.log('Successfully uploaded image');
		console.log('ImageUrl: ', imageUrl);
	});

	return imageUrl;

};


module.exports = image;
