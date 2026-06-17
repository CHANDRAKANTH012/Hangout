import Notification from '../models/Notification.js';
import Hangout from '../models/Hangout.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// GET /api/notifications?tab=all|requests|updates
export const getNotifications = asyncHandler(async (req, res) => {
  const { tab = 'all' } = req.query;
  const userId = req.user._id;

  
  
  let filter = {};

  switch (tab) {
    case 'requests':
      // Host sees incoming join requests
      filter = { receiver: userId, type: 'join_request', status: 'pending' };
      console.log(filter)
      break;
    case 'updates':
      // User sees responses to their join requests
      filter = { sender: userId, type: 'join_request', status: { $in: ['accepted', 'rejected'] } };
      console.log(filter)
      break;
    case 'all':
    default:
      // All notifications where user is involved
      filter = { $or: [{ sender: userId }, { receiver: userId }] };
      console.log(filter)
      break;
  }

  const notifications = await Notification.find(filter)
    .populate('sender', 'name username avatar')
    .populate('receiver', 'name username avatar')
    .populate('hangout', 'title vibe location startTime status')
    .sort({ createdAt: -1 })
    .lean();

  // Count unread per tab
  const [requestsCount, updatesCount] = await Promise.all([
    Notification.countDocuments({ receiver: userId, type: 'join_request', status: 'pending', read: false }),
    Notification.countDocuments({ sender: userId, type: 'join_request', status: { $in: ['accepted', 'rejected'] }, read: false }),
  ]);

  res.status(200).json({
    success: true,
    count: notifications.length,
    unread: { requests: requestsCount, updates: updatesCount },
    notifications,
  });
});

// PUT /api/notifications/:id/respond  { action: 'accepted' | 'rejected' }
export const respondToRequest = asyncHandler(async (req, res) => {
  const { action } = req.body;

  if (!['accepted', 'rejected'].includes(action)) {
    throw new ApiError(400, 'Action must be "accepted" or "rejected"');
  }

  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  // Only the receiver (host) can respond
  if (notification.receiver.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Only the host can respond to this request');
  }

  if (notification.status !== 'pending') {
    throw new ApiError(400, 'This request has already been responded to');
  }

  // Update notification status
  notification.status = action;
  await notification.save();

  // If accepted, add user to hangout participants
  if (action === 'accepted') {
    const hangout = await Hangout.findById(notification.hangout);
    if (hangout && !hangout.participants.some(p => p.toString() === notification.sender.toString())) {
      hangout.participants.push(notification.sender);
      await hangout.save();
    }
  }

  await notification.populate([
    { path: 'sender', select: 'name username avatar' },
    { path: 'receiver', select: 'name username avatar' },
    { path: 'hangout', select: 'title vibe' },
  ]);

  res.status(200).json({
    success: true,
    message: `Request ${action}`,
    notification,
  });
});

// PUT /api/notifications/:id/read
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  // Only involved users can mark as read
  const userId = req.user._id.toString();
  if (notification.sender.toString() !== userId && notification.receiver.toString() !== userId) {
    throw new ApiError(403, 'Not authorized');
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({
    success: true,
    notification,
  });
});
