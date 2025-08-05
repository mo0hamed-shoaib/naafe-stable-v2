const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// ------------------------------
// Base User Schema & Discriminators
// ------------------------------
const baseUserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters long']
  },
  name: {
    first: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, 'First name must be at least 2 characters']
    },
    last: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters']
    }
  },
  phone: {
    type: String,
    required: true,
    match: [/^(\+20|0)?1[0125][0-9]{8}$/, 'Please enter a valid Egyptian phone number']
  },
  avatarUrl: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['admin', 'seeker', 'provider'],
    required: true
  },
  // Profile & Location (GeoJSON)
  profile: {
    bio: {
      type: String,
      maxlength: 1000,
      trim: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0] // [longitude, latitude]
      }
    },
    skills: [String],
    languages: [String]
  },
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockedReason: String,
  lastLoginAt: Date
}, {
  discriminatorKey: 'role',
  timestamps: true
});

// Indexes
baseUserSchema.index({ 'profile.location': '2dsphere' });
baseUserSchema.index({ email: 1 });
baseUserSchema.index({ phone: 1 });
baseUserSchema.index({ role: 1, isActive: 1 });

// Virtual for full name
baseUserSchema.virtual('fullName').get(function() {
  return `${this.name.first} ${this.name.last}`;
});

const User = mongoose.model('User', baseUserSchema);

// Provider Schema
const providerSchema = new Schema({
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalJobsCompleted: {
    type: Number,
    default: 0,
    min: 0
  },
  totalEarnings: {
    type: Number,
    default: 0,
    min: 0
  }
});

const Provider = User.discriminator('provider', providerSchema);

// Virtual field to get provider's services from ServiceListing
providerSchema.virtual('services', {
  ref: 'ServiceListing',
  localField: '_id',
  foreignField: 'provider',
  match: { status: 'active' }
});

// Method to get services (alternative approach)
providerSchema.methods.getServices = async function() {
  const ServiceListing = mongoose.model('ServiceListing');
  return await ServiceListing.find({ 
    provider: this._id, 
    status: 'active' 
  }).select('title category price deliveryTimeDays rating');
};

// Seeker Schema
const seekerSchema = new Schema({
  totalJobsPosted: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: 0
  }
});

const Seeker = User.discriminator('seeker', seekerSchema);

// Admin Schema
const adminSchema = new Schema({
  isSuperAdmin: {
    type: Boolean,
    default: false
  },
  permissions: [String]
});

const Admin = User.discriminator('admin', adminSchema);

// ------------------------------
// Category Schema
// ------------------------------
const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: String,
  icon: String,
  isActive: {
    type: Boolean,
    default: true
  },
}, {
  timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

// ------------------------------
// JobRequest Schema
// ------------------------------
const jobRequestSchema = new Schema({
  seeker: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [10, 'Title must be at least 10 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000,
    trim: true
  },
  category: {
    type: String,
    required: true,
    validate: {
      validator: async function(categoryName) {
        const Category = mongoose.model('Category');
        const category = await Category.findOne({ name: categoryName, isActive: true });
        return category !== null;
      },
      message: 'Category does not exist or is not active'
    }
  },
  budget: {
    min: {
      type: Number,
      required: true,
      min: [0, 'Minimum budget cannot be negative']
    },
    max: {
      type: Number,
      required: true,
      min: [0, 'Maximum budget cannot be negative']
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: String
  },
  attachments: [{
    url: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true
    },
    fileType: String,
    fileSize: Number
  }],
  status: {
    type: String,
    enum: ['open', 'assigned', 'in_progress', 'completed', 'cancelled'],
    default: 'open'
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: async function(userId) {
        if (!userId) return true; // Allow null/undefined
        const User = mongoose.model('User');
        const user = await User.findById(userId);
        return user && user.role === 'provider';
      },
      message: 'Assigned user must be a provider'
    }
  },
  deadline: {
    type: Date,
    required: true
  },
  estimatedDuration: {
    type: Number, // in days
    min: 1
  },
  completionProof: {
    images: [String],
    description: String,
    completedAt: Date
  }
}, {
  timestamps: true
});

jobRequestSchema.index({ location: '2dsphere' });
jobRequestSchema.index({ seeker: 1, status: 1 });
jobRequestSchema.index({ category: 1, status: 1 });
jobRequestSchema.index({ deadline: 1 });

// Validation for budget
jobRequestSchema.pre('save', function(next) {
  if (this.budget.min > this.budget.max) {
    return next(new Error('Minimum budget cannot be greater than maximum budget'));
  }
  next();
});

const JobRequest = mongoose.model('JobRequest', jobRequestSchema);

// ------------------------------
// Offer Schema
// ------------------------------
const offerSchema = new Schema({
  jobRequest: {
    type: Schema.Types.ObjectId,
    ref: 'JobRequest',
    required: true
  },
  provider: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    amount: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'EGP',
      enum: ['EGP', 'USD', 'EUR']
    }
  },
  message: {
    type: String,
    maxlength: 1000,
    trim: true
  },
  estimatedTimeDays: {
    type: Number,
    default: 1,
    min: [1, 'Estimated time must be at least 1 day']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  }
}, {
  timestamps: true
});

offerSchema.index({ jobRequest: 1, status: 1 });
offerSchema.index({ provider: 1, status: 1 });

// Validation for offers
offerSchema.pre('save', async function(next) {
  if (this.isNew) {
    const JobRequest = mongoose.model('JobRequest');
    const jobRequest = await JobRequest.findById(this.jobRequest);
    
    if (!jobRequest) {
      return next(new Error('Job request not found'));
    }
    
    if (jobRequest.status !== 'open') {
      return next(new Error('Can only make offers on open job requests'));
    }
    
    // Check if provider already made an offer
    const existingOffer = await mongoose.model('Offer').findOne({
      jobRequest: this.jobRequest,
      provider: this.provider,
      status: { $in: ['pending', 'accepted'] }
    });
    
    if (existingOffer) {
      return next(new Error('Provider already made an offer on this job'));
    }
  }
  next();
});

const Offer = mongoose.model('Offer', offerSchema);

// ------------------------------
// ServiceListing Schema
// ------------------------------
const serviceListingSchema = new Schema({
  provider: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [10, 'Title must be at least 10 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: true,
    maxlength: 3000,
    trim: true
  },
  category: {
    type: String,
    required: true,
    validate: {
      validator: async function(categoryName) {
        const Category = mongoose.model('Category');
        const category = await Category.findOne({ name: categoryName, isActive: true });
        return category !== null;
      },
      message: 'Category does not exist or is not active'
    }
  },
  price: {
    amount: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'EGP',
      enum: ['EGP', 'USD', 'EUR']
    }
  },
  deliveryTimeDays: {
    type: Number,
    default: 1,
    min: [1, 'Delivery time must be at least 1 day']
  },
  attachments: [{
    url: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true
    },
    fileType: String,
    fileSize: Number
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number],
    address: String
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'archived'],
    default: 'active'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalSales: {
    type: Number,
    default: 0,
    min: 0
  },
  features: [String],
  requirements: [String]
}, {
  timestamps: true
});

serviceListingSchema.index({ location: '2dsphere' });
serviceListingSchema.index({ provider: 1, status: 1 });
serviceListingSchema.index({ category: 1, status: 1 });
serviceListingSchema.index({ provider: 1 }); // For provider queries

const ServiceListing = mongoose.model('ServiceListing', serviceListingSchema);

// ------------------------------
// Review Schema
// ------------------------------
const reviewSchema = new Schema({
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewedUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobRequest: {
    type: Schema.Types.ObjectId,
    ref: 'JobRequest'
  },
  serviceListing: {
    type: Schema.Types.ObjectId,
    ref: 'ServiceListing'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 1000,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  reported: {
    type: Boolean,
    default: false
  },
  reportReason: String
}, {
  timestamps: true
});

reviewSchema.index({ reviewedUser: 1, createdAt: -1 });
reviewSchema.index({ reviewer: 1, reviewedUser: 1 }, { unique: true });
reviewSchema.index({ jobRequest: 1 });
reviewSchema.index({ serviceListing: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isPublic: 1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = {
  User,
  Provider,
  Seeker,
  Admin,
  Category,
  JobRequest,
  Offer,
  ServiceListing,
  Review
};
