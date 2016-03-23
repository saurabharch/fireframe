app.factory('UserFactory', function($http){

	var factory = {

		getUserTeams: function(userId){
			return $http.get('/api/user/'+userId+'/teams')
			.then(response => response.data);
		},

		addTeam: function(team){
			return $http.post('/api/teams', team)
			.then(response => response.data);
		}

	};

	return factory;
});