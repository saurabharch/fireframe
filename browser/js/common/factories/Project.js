app.factory('Project', function($http, $log){

	function extractData(res) {
		return res.data;
	}

	var factory = {

		fetchProject: function(projectId){
			return $http.get('/api/projects/'+projectId)
			.then(extractData)
			.catch($log);
		},

		submitComment: function(projectId, comment) {
			return $http.post('/api/projects/' + projectId + '/comments', {
				content: comment
			})
			.then(extractData)
			.catch($log);
		}

	};

	return factory;

});