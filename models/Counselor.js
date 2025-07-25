const mongoose = require('mongoose');

const counselorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Counselor', counselorSchema);
