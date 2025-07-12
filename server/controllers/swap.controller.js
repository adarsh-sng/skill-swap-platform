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
