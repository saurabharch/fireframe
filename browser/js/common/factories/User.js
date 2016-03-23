app.factory('UserFactory', function($http, $log){

	var factory = {

		getUserTeams: function(userId){
			return $http.get('/api/user/'+userId+'/teams')
			.then(response => response.data)
			.catch($log);
		},

		addTeam: function(team){
			return $http.post('/api/teams', team)
			.then(response => response.data)
			.catch($log);
		},

		addProject: function(project){
			return $http.post('/api/projects', project)
			.then(response => response.data)
			.catch($log);
		}		

	};

	return factory;
});