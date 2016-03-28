var mongoose = require('mongoose');
var User = mongoose.model('User');

var TeamSchema = new mongoose.Schema({
  
  name: {
  	type: String,
  	required: true
  },
  administrator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]

});

TeamSchema.statics.createAndAddMembers = function(newTeam) {
  var team;
  var memberEmails = newTeam.members;
  newTeam.members = null;

  return this.create(newTeam)
  .then(createdTeam => {
    console.log(createdTeam, "new team");
    team = createdTeam;
    return User.find({
      email: { $in : memberEmails }
    })
  })
  .then(users => {
    console.log(users, "team members?");
    team.members = users;
    return team.save()
  })
}

mongoose.model('Team', TeamSchema);