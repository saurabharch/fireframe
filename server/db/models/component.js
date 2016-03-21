var mongoose = require('mongoose');

var ComponentSchema = new mongoose.Schema({
  type: String,
  style: {
    id: String,
    width: Number,
    height: Number,
    color: String,
    opacity: Number,
    "z-index": Number
  },
  wireframe: {
    type:mongoose.Schema.Types.ObjectId, 
    ref:'Wireframe'
  }
});

mongoose.model('Component', ComponentSchema);