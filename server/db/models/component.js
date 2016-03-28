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
  innerHtml:String,
  wireframe: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Wireframe',
    required: true
  }
});

mongoose.model('Component', ComponentSchema);