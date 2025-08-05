import mongoose from 'mongoose';
const { Schema } = mongoose;

const messageSchema = new Schema({
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: [2000, 'Message content cannot exceed 2000 characters']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
messageSchema.index({ conversationId: 1, timestamp: 1 });
messageSchema.index({ senderId: 1 });
messageSchema.index({ receiverId: 1 });
messageSchema.index({ timestamp: -1 });

// Compound index for finding messages between two users
messageSchema.index({ 
  $or: [
    { senderId: 1, receiverId: 1 },
    { senderId: 1, receiverId: 1 }
  ]
});

// Index for unread messages
messageSchema.index({ receiverId: 1, read: 1 });

const Message = mongoose.model('Message', messageSchema);
export default Message; 