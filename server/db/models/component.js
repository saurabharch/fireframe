var mongoose = require('mongoose');

var ComponentSchema = new mongoose.Schema({
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  absX: {
    type: Number,
    required: true
  },
  absY: {
    type: Number,
    required: true
  },
  absHeight: {
    type: Number,
    required: true
  },
  absWidth: {
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