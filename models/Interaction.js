const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  counselorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Counselor',
    required: true
  },
  interactionType: {
    type: String,
    enum: ['call', 'demo', 'followup', 'email'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  },
  duration: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Interaction', interactionSchema);
