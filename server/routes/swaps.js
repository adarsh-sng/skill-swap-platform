import express from 'express';
import SwapRequest from '../models/SwapRequest.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all swap requests for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    // Get both incoming and outgoing requests
    const incomingRequests = await SwapRequest.find({ toUser: req.user._id })
      .populate('fromUser', 'name email location rating swapCount')
      .sort({ createdAt: -1 });

    const outgoingRequests = await SwapRequest.find({ fromUser: req.user._id })
      .populate('toUser', 'name email location rating swapCount')
      .sort({ createdAt: -1 });

    // Combine and format the requests
    const allRequests = [
      ...incomingRequests.map(req => ({
        ...req.toObject(),
        fromUser: req.fromUser,
        toUser: req.toUser
      })),
      ...outgoingRequests.map(req => ({
        ...req.toObject(),
        fromUser: req.fromUser,
        toUser: req.toUser
      }))
    ];

    res.json(allRequests);
  } catch (error) {
    console.error('Get swap requests error:', error);
    res.status(500).json({ message: 'Server error getting swap requests' });
  }
});

// Create a new swap request
router.post('/request', auth, async (req, res) => {
  try {
    const { toUserId, requestedSkill, offeredSkill, message, proposedTime } = req.body;

    // Validate required fields
    if (!toUserId || !requestedSkill || !offeredSkill || !message || !proposedTime) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if target user exists
    const targetUser = await User.findById(toUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    // Check if target user is public
    if (!targetUser.isPublic) {
      return res.status(403).json({ message: 'Cannot send request to private profile' });
    }

    // Check if users can make a request (no existing pending requests)
    const canMakeRequest = await SwapRequest.canMakeRequest(req.user._id, toUserId);
    if (!canMakeRequest) {
      return res.status(400).json({ message: 'A pending request already exists between these users' });
    }

    // Validate that requested skill is offered by target user
    if (!targetUser.skillsOffered.includes(requestedSkill)) {
      return res.status(400).json({ message: 'Requested skill is not offered by target user' });
    }

    // Validate that offered skill is offered by current user
    if (!req.user.skillsOffered.includes(offeredSkill)) {
      return res.status(400).json({ message: 'Offered skill is not in your skills list' });
    }

    // Create swap request
    const swapRequest = new SwapRequest({
      fromUser: req.user._id,
      toUser: toUserId,
      requestedSkill,
      offeredSkill,
      message,
      proposedTime
    });

    await swapRequest.save();

    // Populate user details for response
    await swapRequest.populate([
      { path: 'fromUser', select: 'name location rating swapCount' },
      { path: 'toUser', select: 'name location rating swapCount' }
    ]);

    res.status(201).json({
      message: 'Swap request sent successfully',
      swapRequest
    });
  } catch (error) {
    console.error('Create swap request error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error creating swap request' });
  }
});

// Get user's swap requests (incoming and outgoing)
router.get('/my-requests', auth, async (req, res) => {
  try {
    const incomingRequests = await SwapRequest.find({ toUser: req.user._id })
      .populate('fromUser', 'name location rating swapCount')
      .sort({ createdAt: -1 });

    const outgoingRequests = await SwapRequest.find({ fromUser: req.user._id })
      .populate('toUser', 'name location rating swapCount')
      .sort({ createdAt: -1 });

    res.json({
      incoming: incomingRequests,
      outgoing: outgoingRequests
    });
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({ message: 'Server error getting requests' });
  }
});

// Accept a swap request
router.put('/:requestId/accept', auth, async (req, res) => {
  try {
    const { requestId } = req.params;

    const swapRequest = await SwapRequest.findById(requestId);
    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if user is the recipient of the request
    if (swapRequest.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to accept this request' });
    }

    // Check if request is still pending
    if (swapRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Request is no longer pending' });
    }

    // Accept the request
    await swapRequest.accept();

    // Populate user details for response
    await swapRequest.populate([
      { path: 'fromUser', select: 'name location rating swapCount' },
      { path: 'toUser', select: 'name location rating swapCount' }
    ]);

    res.json({
      message: 'Swap request accepted successfully',
      swapRequest
    });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ message: 'Server error accepting request' });
  }
});

// Reject a swap request
router.put('/:requestId/reject', auth, async (req, res) => {
  try {
    const { requestId } = req.params;

    const swapRequest = await SwapRequest.findById(requestId);
    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if user is the recipient of the request
    if (swapRequest.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reject this request' });
    }

    // Check if request is still pending
    if (swapRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Request is no longer pending' });
    }

    // Reject the request
    await swapRequest.reject();

    // Populate user details for response
    await swapRequest.populate([
      { path: 'fromUser', select: 'name location rating swapCount' },
      { path: 'toUser', select: 'name location rating swapCount' }
    ]);

    res.json({
      message: 'Swap request rejected successfully',
      swapRequest
    });
  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({ message: 'Server error rejecting request' });
  }
});

// Cancel a swap request (by sender)
router.put('/:requestId/cancel', auth, async (req, res) => {
  try {
    const { requestId } = req.params;

    const swapRequest = await SwapRequest.findById(requestId);
    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if user is the sender of the request
    if (swapRequest.fromUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this request' });
    }

    // Check if request is still pending
    if (swapRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Request is no longer pending' });
    }

    // Cancel the request
    await swapRequest.cancel();

    // Populate user details for response
    await swapRequest.populate([
      { path: 'fromUser', select: 'name location rating swapCount' },
      { path: 'toUser', select: 'name location rating swapCount' }
    ]);

    res.json({
      message: 'Swap request cancelled successfully',
      swapRequest
    });
  } catch (error) {
    console.error('Cancel request error:', error);
    res.status(500).json({ message: 'Server error cancelling request' });
  }
});

// Complete a swap and add ratings
router.put('/:requestId/complete', auth, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { rating, feedback } = req.body;

    const swapRequest = await SwapRequest.findById(requestId);
    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if user is involved in the swap
    if (swapRequest.fromUser.toString() !== req.user._id.toString() && 
        swapRequest.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to complete this swap' });
    }

    // Check if request is accepted
    if (swapRequest.status !== 'accepted') {
      return res.status(400).json({ message: 'Swap must be accepted before completion' });
    }

    // If rating and feedback are provided, update them
    if (rating && feedback) {
      // Update rating and feedback based on user role
      if (swapRequest.fromUser.toString() === req.user._id.toString()) {
        swapRequest.fromUserRating = rating;
        swapRequest.fromUserFeedback = feedback;
      } else {
        swapRequest.toUserRating = rating;
        swapRequest.toUserFeedback = feedback;
      }

      // If both users have rated, mark as completed
      if (swapRequest.fromUserRating && swapRequest.toUserRating) {
        await swapRequest.complete();

        // Update user swap counts and ratings
        const fromUser = await User.findById(swapRequest.fromUser);
        const toUser = await User.findById(swapRequest.toUser);

        if (fromUser && toUser) {
          fromUser.swapCount += 1;
          toUser.swapCount += 1;

          // Update average ratings
          const fromUserSwaps = await SwapRequest.find({
            $or: [{ fromUser: fromUser._id }, { toUser: fromUser._id }],
            status: 'completed',
            $or: [{ fromUserRating: { $exists: true } }, { toUserRating: { $exists: true } }]
          });

          const toUserSwaps = await SwapRequest.find({
            $or: [{ fromUser: toUser._id }, { toUser: toUser._id }],
            status: 'completed',
            $or: [{ fromUserRating: { $exists: true } }, { toUserRating: { $exists: true } }]
          });

          // Calculate average ratings
          const fromUserRatings = fromUserSwaps.map(swap => 
            swap.fromUser.toString() === fromUser._id.toString() 
              ? swap.fromUserRating 
              : swap.toUserRating
          ).filter(rating => rating);

          const toUserRatings = toUserSwaps.map(swap => 
            swap.fromUser.toString() === toUser._id.toString() 
              ? swap.fromUserRating 
              : swap.toUserRating
          ).filter(rating => rating);

          fromUser.rating = fromUserRatings.length > 0 
            ? fromUserRatings.reduce((a, b) => a + b, 0) / fromUserRatings.length 
            : 0;
          toUser.rating = toUserRatings.length > 0 
            ? toUserRatings.reduce((a, b) => a + b, 0) / toUserRatings.length 
            : 0;

          await fromUser.save();
          await toUser.save();
        }
      } else {
        await swapRequest.save();
      }
    } else {
      // No rating/feedback provided, just mark as completed
      await swapRequest.complete();
    }

    // Populate user details for response
    await swapRequest.populate([
      { path: 'fromUser', select: 'name location rating swapCount' },
      { path: 'toUser', select: 'name location rating swapCount' }
    ]);

    res.json({
      message: 'Swap updated successfully',
      swapRequest
    });
  } catch (error) {
    console.error('Complete swap error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error completing swap' });
  }
});

// Get swap request by ID
router.get('/:requestId', auth, async (req, res) => {
  try {
    const { requestId } = req.params;

    const swapRequest = await SwapRequest.findById(requestId)
      .populate('fromUser', 'name location rating swapCount')
      .populate('toUser', 'name location rating swapCount');

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if user is involved in the swap
    if (swapRequest.fromUser._id.toString() !== req.user._id.toString() && 
        swapRequest.toUser._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this swap request' });
    }

    res.json({ swapRequest });
  } catch (error) {
    console.error('Get swap request error:', error);
    res.status(500).json({ message: 'Server error getting swap request' });
  }
});

export default router; 