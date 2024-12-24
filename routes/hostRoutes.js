const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation
const User = require('../models/User');

// GET host by ID with extended details
router.get('/:id', async (req, res) => {
  const hostId = req.params.id;

  // Validate if the provided ID is a valid ObjectID
  if (!mongoose.Types.ObjectId.isValid(hostId)) {
    return res.status(400).json({ error: 'Invalid host ID' });
  }

  try {
    const host = await User.findById(hostId).where({ role: 'host' });
    if (!host) {
      return res.status(404).json({ error: 'Host not found' });
    }
    res.status(200).json({
      name: host.name,
      bio: host.bio,
      location: {
        generalAddress: host.location.generalAddress,
        geo: host.location.geo,
      },
      hostingPreferences: host.hostingPreferences,
      airportPickup: host.airportPickup,
      lifestyle: host.lifestyle,
      ratings: host.ratings,
      verified: host.verified,
    });
  } catch (error) {
    console.error('Error fetching host:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
