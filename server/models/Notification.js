import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['join_request', 'join_accepted', 'join_rejected', 'system', 'reminder'],
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hangout: { type: mongoose.Schema.Types.ObjectId, ref: 'Hangout', required: true },
  message: { type: String, default: '', trim: true, maxlength: 500 },
  read: { type: Boolean, default: false },
}, {
  timestamps: true,
});

// Index for fetching user notifications efficiently
notificationSchema.index({ receiver: 1, createdAt: -1 });
notificationSchema.index({ sender: 1, createdAt: -1 });
notificationSchema.index({ hangout: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
