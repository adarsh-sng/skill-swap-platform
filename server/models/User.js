import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  skillsOffered: [{
    type: String,
    trim: true,
    maxlength: [50, 'Skill name cannot be more than 50 characters']
  }],
  skillsWanted: [{
    type: String,
    trim: true,
    maxlength: [50, 'Skill name cannot be more than 50 characters']
  }],
  availability: {
    monday: {
      morning: { type: Boolean, default: false },
      afternoon: { type: Boolean, default: false },
      evening: { type: Boolean, default: false }
    },
    tuesday: {
      morning: { type: Boolean, default: false },
      afternoon: { type: Boolean, default: false },
      evening: { type: Boolean, default: false }
    },
    wednesday: {
      morning: { type: Boolean, default: false },
      afternoon: { type: Boolean, default: false },
      evening: { type: Boolean, default: false }
    },
    thursday: {
      morning: { type: Boolean, default: false },
      afternoon: { type: Boolean, default: false },
      evening: { type: Boolean, default: false }
    },
    friday: {
      morning: { type: Boolean, default: false },
      afternoon: { type: Boolean, default: false },
      evening: { type: Boolean, default: false }
    },
    saturday: {
      morning: { type: Boolean, default: false },
      afternoon: { type: Boolean, default: false },
      evening: { type: Boolean, default: false }
    },
    sunday: {
      morning: { type: Boolean, default: false },
      afternoon: { type: Boolean, default: false },
      evening: { type: Boolean, default: false }
    }
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot be more than 5']
  },
  swapCount: {
    type: Number,
    default: 0,
    min: [0, 'Swap count cannot be negative']
  },
  avatar: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.email;
  return userObject;
};

// Index for search functionality
userSchema.index({ name: 'text', location: 'text', skillsOffered: 'text', skillsWanted: 'text' });

const User = mongoose.model('User', userSchema);

export default User; 