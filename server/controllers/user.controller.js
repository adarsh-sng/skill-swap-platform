import User from '../models/User.js';

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.status(200).json(user);
};

export const updateProfile = async (req, res) => {
  const updates = req.body;

  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

export const getAllPublicUsers = async (req, res) => {
  try {
    const users = await User.find({ isPublic: true }).select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch users' });
  }
};