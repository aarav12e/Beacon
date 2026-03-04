const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Watchlist = require('../models/Watchlist');

router.get('/', protect, async (req, res) => {
  const items = await Watchlist.find({ user: req.user._id });
  res.json({ items });
});

router.post('/', protect, async (req, res) => {
  const item = await Watchlist.create({ ...req.body, user: req.user._id });
  res.status(201).json({ item });
});

router.put('/:id/add-stock', protect, async (req, res) => {
  const { symbol, exchange, notes } = req.body;
  const list = await Watchlist.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $addToSet: { stocks: { symbol, exchange, notes } } },
    { new: true }
  );
  res.json({ list });
});

router.put('/:id/remove-stock', protect, async (req, res) => {
  const { symbol } = req.body;
  const list = await Watchlist.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $pull: { stocks: { symbol } } },
    { new: true }
  );
  res.json({ list });
});

router.delete('/:id', protect, async (req, res) => {
  await Watchlist.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: 'Deleted' });
});

module.exports = router;
