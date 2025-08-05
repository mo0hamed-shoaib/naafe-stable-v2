import mongoose from 'mongoose';
const { Schema } = mongoose;

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
    address: String,
    government: String,
    city: String,
    street: String,
    apartmentNumber: String,
    additionalInformation: String
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
        return user && user.roles && user.roles.includes('provider');
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

// Indexes
// Remove geo index
// jobRequestSchema.index({ location: '2dsphere' });
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
export default JobRequest; 