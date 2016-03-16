var mongoose = require('mongoose');

var TeamSchema = new mongoose.Schema({
  creadminator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

});

mongoose.model('Teams', TeamSchema);