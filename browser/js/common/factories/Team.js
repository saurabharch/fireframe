app.factory('Team', function($http, $log){

  function extractData(res) {
    return res.data;
  }

  function getMasterWireframe(project) {
    return $.grep(project.wireframes, e => e.master === true)[0];
  }

  var factory = {

    fetchTeamProjects: function(teamid){
      return $http.get('/api/teams/' + teamid + '/projects')
      .then(extractData)
      .then(projects => {
        projects.forEach(function(project) {
          project.master = getMasterWireframe(project);
        });
        return projects;
      })
      .catch($log);
    },

  };

  return factory;

});