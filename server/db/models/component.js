var mongoose = require('mongoose');

var ComponentSchema = new mongoose.Schema({
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  xCoord: {
    type: Number,
    required: true
  },
  yCoord: {
    type: Number,
    required: true
  },
  style: {
    width: Number,
    height: Number,
    color: String,
    opacity: Number,
    zIndex: Number
  },
  type: String
});

module.exports = ('Component', ComponentSchema);