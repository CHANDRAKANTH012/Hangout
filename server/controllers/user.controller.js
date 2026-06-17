import User from '../models/User.js';
import Hangout from '../models/Hangout.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadImage, deleteImage } from '../services/cloudinary.service.js';

// GET /api/users/:id
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-settings');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Compute stats
  const [hangoutsCreated, hangoutsJoined] = await Promise.all([
    Hangout.countDocuments({ host: user._id }),
    Hangout.countDocuments({ participants: user._id }),
  ]);

  // People met = unique participants across all hangouts the user joined (excluding self)
  const joinedHangouts = await Hangout.find({ participants: user._id }).select('participants').lean();
  const uniquePeople = new Set();
  joinedHangouts.forEach(h => {
    h.participants.forEach(p => {
      if (p.toString() !== user._id.toString()) uniquePeople.add(p.toString());
    });
  });

  res.status(200).json({
    success: true,
    user,
    stats: {
      hangoutsCreated,
      hangoutsJoined,
      peopleMet: uniquePeople.size,
    },
  });
});

// PUT /api/users/me
export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'username', 'bio', 'settings'];
  const updates = {};

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  // Handle avatar upload
  if (req.file) {
    // Delete old avatar
    if (req.user.avatar && req.user.avatar.publicId) {
      await deleteImage(req.user.avatar.publicId);
    }
    const uploaded = await uploadImage(req.file.path, 'hangout/avatars');
    updates.avatar = uploaded;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// GET /api/users/me/hangouts?tab=created|joined|past
export const getMyHangouts = asyncHandler(async (req, res) => {
  const { tab = 'created' } = req.query;
  const userId = req.user._id;
  let filter = {};

  switch (tab) {
    case 'created':
      filter = { host: userId, status: { $in: ['active', 'full'] } };
      break;
    case 'joined':
      filter = { participants: userId, host: { $ne: userId }, status: { $in: ['active', 'full'] } };
      break;
    case 'past':
      filter = { $or: [{ host: userId }, { participants: userId }], status: 'ended' };
      break;
  }

  const hangouts = await Hangout.find(filter)
    .populate('host', 'name username avatar')
    .sort({ startTime: -1 })
    .lean();

  res.status(200).json({
    success: true,
    count: hangouts.length,
    hangouts,
  });
});
