const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
    trim: true,
    maxlength: 40
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  avatar: {
    type: String,
    required: true,
    maxlength: 4
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1200
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const CommentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
    trim: true,
    maxlength: 40
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  avatar: {
    type: String,
    required: true,
    maxlength: 4
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1200
  },
  isAnon: {
    type: Boolean,
    default: true
  },
  planet: {
    type: String,
    enum: ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', null],
    default: null,
    index: true
  },
  signalLevel: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  likedBy: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    default: [],
    select: false
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  replies: {
    type: [ReplySchema],
    default: []
  }
});

CommentSchema.index({ planet: 1, timestamp: -1 });

module.exports = mongoose.model('Comment', CommentSchema);
