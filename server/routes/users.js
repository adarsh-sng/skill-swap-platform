import express from 'express';
import User from '../models/User.js';
import { auth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get popular skills (must come before /:userId route)
router.get('/skills/popular', async (req, res) => {
  try {
    const pipeline = [
      { $match: { isPublic: true } },
      { $unwind: '$skillsOffered' },
      {
        $group: {
          _id: '$skillsOffered',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          skill: '$_id',
          count: 1,
          _id: 0
        }
      }
    ];

    const popularOffered = await User.aggregate(pipeline);

    const wantedPipeline = [
      { $match: { isPublic: true } },
      { $unwind: '$skillsWanted' },
      {
        $group: {
          _id: '$skillsWanted',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          skill: '$_id',
          count: 1,
          _id: 0
        }
      }
    ];

    const popularWanted = await User.aggregate(wantedPipeline);

    res.json({
      offered: popularOffered,
      wanted: popularWanted
    });
  } catch (error) {
    console.error('Get popular skills error:', error);
    res.status(500).json({ message: 'Server error getting popular skills' });
  }
});

// Search users by skills (must come before /:userId route)
router.get('/search/skills', optionalAuth, async (req, res) => {
  try {
    const { skill, type = 'offered' } = req.query;
    
    if (!skill) {
      return res.status(400).json({ message: 'Skill parameter is required' });
    }

    let query = { isPublic: true };
    
    // Exclude current user from results
    if (req.user) {
      query._id = { $ne: req.user._id };
    }

    // Search in skills based on type
    if (type === 'offered') {
      query.skillsOffered = { $regex: skill, $options: 'i' };
    } else if (type === 'wanted') {
      query.skillsWanted = { $regex: skill, $options: 'i' };
    } else {
      query.$or = [
        { skillsOffered: { $regex: skill, $options: 'i' } },
        { skillsWanted: { $regex: skill, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password -email')
      .sort({ rating: -1, swapCount: -1 })
      .limit(20);

    res.json({ users });
  } catch (error) {
    console.error('Search skills error:', error);
    res.status(500).json({ message: 'Server error searching skills' });
  }
});

// Get user statistics (must come before /:userId route)
router.get('/stats/overview', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isPublic: true });
    const totalSwaps = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$swapCount' } } }
    ]);

    const topSkills = await User.aggregate([
      { $match: { isPublic: true } },
      { $unwind: '$skillsOffered' },
      {
        $group: {
          _id: '$skillsOffered',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalUsers,
      totalSwaps: totalSwaps[0]?.total || 0,
      topSkills
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error getting statistics' });
  }
});

// Get all public users (general endpoint)
router.get('/', optionalAuth, async (req, res) => {
  try {
    let query = { isPublic: true };
    
    // Exclude current user from results
    if (req.user) {
      query._id = { $ne: req.user._id };
    }

    const users = await User.find(query)
      .select('-password -email')
      .sort({ name: 1 });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error getting users' });
  }
});

// Get all public users (for browsing with filters)
router.get('/browse', optionalAuth, async (req, res) => {
  try {
    const {
      search,
      filterType,
      sortBy = 'name',
      page = 1,
      limit = 12
    } = req.query;

    const skip = (page - 1) * limit;
    
    // Build query
    let query = { isPublic: true };
    
    // Exclude current user from results
    if (req.user) {
      query._id = { $ne: req.user._id };
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by skill type
    if (filterType && filterType !== 'all') {
      if (filterType === 'offered') {
        query.skillsOffered = { $exists: true, $ne: [] };
      } else if (filterType === 'wanted') {
        query.skillsWanted = { $exists: true, $ne: [] };
      }
    }

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'name':
        sort.name = 1;
        break;
      case 'rating':
        sort.rating = -1;
        break;
      case 'swapCount':
        sort.swapCount = -1;
        break;
      case 'recent':
        sort.createdAt = -1;
        break;
      default:
        sort.name = 1;
    }

    // Execute query
    const users = await User.find(query)
      .select('-password -email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasMore: skip + users.length < total
      }
    });
  } catch (error) {
    console.error('Browse users error:', error);
    res.status(500).json({ message: 'Server error browsing users' });
  }
});

// Get user by ID (public profile) - must be last
router.get('/:userId', optionalAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password -email');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is public or if requesting user is the same user
    if (!user.isPublic && (!req.user || req.user._id.toString() !== userId)) {
      return res.status(403).json({ message: 'Profile is private' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error getting user' });
  }
});

export default router; 