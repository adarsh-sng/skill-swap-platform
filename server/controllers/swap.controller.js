import Swap from '../models/swap.model.js';

export const createSwap = async (req, res) => {
  const { toUser, message } = req.body;

  if (!toUser) return res.status(400).json({ message: 'Receiver (toUser) is required' });

  try {
    const swap = await Swap.create({
      fromUser: req.user.id,
      toUser,
      message
    });

    res.status(201).json(swap);
  } catch (err) {
    res.status(500).json({ message: 'Error creating swap request' });
  }
};

export const getSentSwaps = async (req, res) => {
  try {
    const swaps = await Swap.find({ fromUser: req.user.id })
      .populate('toUser', 'name skillsOffered skillsWanted') // return basic info
      .sort({ createdAt: -1 });

    res.json(swaps);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sent swaps' });
  }
};

export const getReceivedSwaps = async (req, res) => {
  try {
    const swaps = await Swap.find({ toUser: req.user.id })
      .populate('fromUser', 'name skillsOffered skillsWanted')
      .sort({ createdAt: -1 });

    res.json(swaps);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching received swaps' });
  }
};

