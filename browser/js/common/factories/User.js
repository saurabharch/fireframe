app.factory('User', function($http, $log){

	var factory = {

		getUserTeams: function(userId){
			return $http.get('/api/users/'+userId+'/teams')
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
		},

		fetchProjects: function() {
			return $http.get('/api/projects/')
			.then(response => response.data)
		}		

	};

	return factory;
});