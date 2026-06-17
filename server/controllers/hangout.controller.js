import Hangout from '../models/Hangout.js';
import Notification from '../models/Notification.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadImage, deleteImage } from '../services/cloudinary.service.js';

// ─── CREATE API ─────────────────────────────────────────────
// POST /api/hangouts
export const createHangout = asyncHandler(async (req, res) => {
  const {
    title, description, vibe, category,
    locationName, locationAddress, lat, lng,
    startTime, endTime,
    maxParticipants, approvalRequired,
    tags, ageLimit, customVibe, restrictions, message,
  } = req.body;

  // Build hangout data
  const hangoutData = {
    title,
    description,
    vibe,
    category,
    location: {
      type: 'Point',
      coordinates: [parseFloat(lng), parseFloat(lat)], // GeoJSON is [lng, lat]
      name: locationName,
      address: locationAddress || '',
    },
    startTime: new Date(startTime),
    endTime: endTime ? new Date(endTime) : undefined,
    host: req.user._id,
    maxParticipants: parseInt(maxParticipants) || 6,
    participants: [req.user._id], // Host is auto-joined
    
    approvalRequired: approvalRequired === 'true' || approvalRequired === true,
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
    ageLimit: parseInt(ageLimit) || 0,
    customVibe: customVibe || '',
    restrictions: restrictions || '',
    message: message || '',
  };

  // Handle image upload if provided
  if (req.file) {
    const uploaded = await uploadImage(req.file.path, 'hangout/images');
    hangoutData.image = uploaded;
  }

  const hangout = await Hangout.create(hangoutData);
  await hangout.populate('host', 'name username avatar');

  res.status(201).json({
    success: true,
    hangout,
  });
});

// ─── PUBLIC API ─────────────────────────────────────────────
// GET /api/hangouts
export const getHangouts = asyncHandler(async (req, res) => {
  const { category, vibe, status, sort, page = 1, limit = 20 } = req.query;

  // Build filter — only public (not approval-based) hangouts
  const filter = {};

  if(!req.user){
    filter.approvalRequired = false;
  }

  // Default: show only active or full, exclude ended
  filter.status = status ? status : { $in: ['active', 'full'] };

  if (category) filter.category = category;
  if (vibe) filter.vibe = vibe;
  

  // Sort options
  let sortOption = { createdAt: -1 }; // newest first
  if (sort === 'popular') sortOption = { 'participants': -1 };
  if (sort === 'starting') sortOption = { startTime: 1 };

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [hangouts, total] = await Promise.all([
    Hangout.find(filter)
      .populate('host', 'name username avatar')
      .populate('participants', 'name username avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Hangout.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: hangouts.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    hangouts,
  });
});

// ─── MAP API ────────────────────────────────────────────────
// GET /api/hangouts/nearby?lat=X&lng=Y&radius=5000&limit=50
export const getNearbyHangouts = asyncHandler(async (req, res) => {
  const { lat, lng, radius = 5000, limit = 50 } = req.query;

  if (!lat || !lng) {
    throw new ApiError(400, 'Latitude and longitude are required');
  }

  const hangouts = await Hangout.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        $maxDistance: parseInt(radius), // meters
      },
    },
    status: { $in: ['active', 'full'] },
  })
    .populate('host', 'name username avatar')
    .limit(parseInt(limit))
    .lean();

  res.status(200).json({
    success: true,
    count: hangouts.length,
    hangouts,
  });
});

// GET /api/hangouts/:id
export const getHangout = asyncHandler(async (req, res) => {
  const hangout = await Hangout.findById(req.params.id)
    .populate('host', 'name username avatar bio')
    .populate('participants', 'name username avatar');

  if (!hangout) {
    throw new ApiError(404, 'Hangout not found');
  }

  res.status(200).json({
    success: true,
    hangout,
  });
});

// ─── MANAGE API ─────────────────────────────────────────────
// PUT /api/hangouts/:id
export const updateHangout = asyncHandler(async (req, res) => {
  let hangout = await Hangout.findById(req.params.id);

  if (!hangout) {
    throw new ApiError(404, 'Hangout not found');
  }

  // Only the host can edit
  if (hangout.host.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Only the host can edit this hangout');
  }

  // Handle image update
  if (req.file) {
    // Delete old image from Cloudinary
    if (hangout.image && hangout.image.publicId) {
      await deleteImage(hangout.image.publicId);
    }
    const uploaded = await uploadImage(req.file.path, 'hangout/images');
    req.body.image = uploaded;
  }

  // Handle location update if coordinates provided
  if (req.body.lat && req.body.lng) {
    req.body.location = {
      type: 'Point',
      coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
      name: req.body.locationName || hangout.location.name,
      address: req.body.locationAddress || hangout.location.address,
    };
  }

  hangout = await Hangout.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate('host', 'name username avatar')
    .populate('participants', 'name username avatar');

  res.status(200).json({
    success: true,
    hangout,
  });
});

// DELETE /api/hangouts/:id
export const deleteHangout = asyncHandler(async (req, res) => {
  const hangout = await Hangout.findById(req.params.id);

  if (!hangout) {
    throw new ApiError(404, 'Hangout not found');
  }

  if (hangout.host.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Only the host can delete this hangout');
  }

  // Delete image from Cloudinary
  if (hangout.image && hangout.image.publicId) {
    await deleteImage(hangout.image.publicId);
  }

  // Delete related notifications
  await Notification.deleteMany({ hangout: hangout._id });

  await Hangout.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Hangout deleted successfully',
  });
});

// ─── JOIN / REQUEST ─────────────────────────────────────────
// POST /api/hangouts/:id/join
export const joinHangout = asyncHandler(async (req, res) => {
  const hangout = await Hangout.findById(req.params.id);

  if (!hangout) {
    throw new ApiError(404, 'Hangout not found');
  }

  if (hangout.status === 'ended') {
    throw new ApiError(400, 'This hangout has ended');
  }

  if (hangout.status === 'full') {
    throw new ApiError(400, 'This hangout is full');
  }

  // Check if already a participant
  if (hangout.participants.some(p => p.toString() === req.user._id.toString())) {
    throw new ApiError(400, 'You have already joined this hangout');
  }

  // Check if there's already a pending request
  if (hangout.approvalRequired) {
    const existingRequest = await Notification.findOne({
      sender: req.user._id,
      hangout: hangout._id,
      type: 'join_request',
      status: 'pending',
    });

    if (existingRequest) {
      throw new ApiError(400, 'You already have a pending request for this hangout');
    }

    // Create a join request notification for the host
    const notification = await Notification.create({
      type: 'join_request',
      status: 'pending',
      sender: req.user._id,
      receiver: hangout.host,
      hangout: hangout._id,
      message: req.body.message || '',
    });

    await notification.populate([
      { path: 'sender', select: 'name username avatar' },
      { path: 'hangout', select: 'title vibe' },
    ]);

    return res.status(200).json({
      success: true,
      message: 'Join request sent! Waiting for host approval.',
      notification,
    });
  }

  // Public hangout — directly join
  hangout.participants.push(req.user._id);
  await hangout.save();

  await hangout.populate('participants', 'name username avatar');

  res.status(200).json({
    success: true,
    message: 'Successfully joined the hangout!',
    hangout,
  });
});

// POST /api/hangouts/:id/leave
export const leaveHangout = asyncHandler(async (req, res) => {
  const hangout = await Hangout.findById(req.params.id);

  if (!hangout) {
    throw new ApiError(404, 'Hangout not found');
  }

  // Host cannot leave their own hangout
  if (hangout.host.toString() === req.user._id.toString()) {
    throw new ApiError(400, 'As the host, you cannot leave. Delete the hangout instead.');
  }

  // Check if user is a participant
  const idx = hangout.participants.findIndex(p => p.toString() === req.user._id.toString());
  if (idx === -1) {
    throw new ApiError(400, 'You are not a participant of this hangout');
  }

  hangout.participants.splice(idx, 1);
  await hangout.save();

  res.status(200).json({
    success: true,
    message: 'You have left the hangout',
  });
});

// kick out option should be provided
