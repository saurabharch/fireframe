var auth = {

	ensureUser: function(req, res, next) {
		if (req.user) {
			next()
		} else {
			next(Error('You shall not pass.'));
		}
	},

	isAdmin: function(user) {
		return user && user.admin
	},
	
	ensureAdmin: function(req, res, next) {
		if (auth.isAdmin(req.user)) {
			next()
		} else {
			next(Error('You shall not pass.'));
		}
	},

	isCurrentUserOrAdmin: function(user, currentUserId) {
		return user && (user._id.equals(currentUserId)) || user.admin;
	},

	ensureCurrentUserOrAdmin: function(req, res, next) {
		if (auth.isCurrentUserOrAdmin(req.user, req.currentUser._id)) {
			next()
		} else {
			next(Error('You shall not pass.'));
		}
	},

	isTeamMember: function(user, team) {
		// return user && (team.members.indexOf(user._id) || auth.isTeamAdmin(user._id));
	},

	isTeamAdmin: function(user, team) {
		// return team.administrator === user._id;
	},

	ensureTeamMemberOrAdmin: function(req, res, next) {
		next()
		// if (auth.isTeamMember(req.user, req.project.team) || auth.isAdmin(req.user)) {
		// 	next()
		// } else {
		// 	next(Error('You shall not pass.'));
		// }
	},

	ensureTeamAdmin: function(req, res, next) {
		next()
		// if (auth.isTeamMember(req.user) || auth.isAdmin(req.user)) {
		// 	next()
		// } else {
		// 	next(Error('You shall not pass.'));
		// }
	}

}

module.exports = auth;