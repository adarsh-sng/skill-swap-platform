import mongoose from 'mongoose';

const swapRequestSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestedSkill: {
    type: String,
    required: [true, 'Requested skill is required'],
    trim: true,
    maxlength: [50, 'Skill name cannot be more than 50 characters']
  },
  offeredSkill: {
    type: String,
    required: [true, 'Offered skill is required'],
    trim: true,
    maxlength: [50, 'Skill name cannot be more than 50 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [1000, 'Message cannot be more than 1000 characters']
  },
  proposedTime: {
    type: String,
    required: [true, 'Proposed time is required'],
    trim: true
  },
  acceptedAt: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },
  fromUserRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
    default: null
  },
  toUserRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
    default: null
  },
  fromUserFeedback: {
    type: String,
    trim: true,
    maxlength: [500, 'Feedback cannot be more than 500 characters'],
    default: null
  },
  toUserFeedback: {
    type: String,
    trim: true,
    maxlength: [500, 'Feedback cannot be more than 500 characters'],
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
swapRequestSchema.index({ fromUser: 1, status: 1 });
swapRequestSchema.index({ toUser: 1, status: 1 });
swapRequestSchema.index({ status: 1, createdAt: -1 });

// Method to check if users can make a swap request
swapRequestSchema.statics.canMakeRequest = async function(fromUserId, toUserId) {
  const existingRequest = await this.findOne({
    $or: [
      { fromUser: fromUserId, toUser: toUserId, status: 'pending' },
      { fromUser: toUserId, toUser: fromUserId, status: 'pending' }
    ]
  });
  
  return !existingRequest;
};

// Method to accept a swap request
swapRequestSchema.methods.accept = function() {
  this.status = 'accepted';
  this.acceptedAt = new Date();
  return this.save();
};

// Method to reject a swap request
swapRequestSchema.methods.reject = function() {
  this.status = 'rejected';
  return this.save();
};

// Method to cancel a swap request
swapRequestSchema.methods.cancel = function() {
  this.status = 'cancelled';
  return this.save();
};

// Method to complete a swap request
swapRequestSchema.methods.complete = function() {
  this.status = 'completed';
  this.completedAt = new Date();
  return this.save();
};

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);

export default SwapRequest; 