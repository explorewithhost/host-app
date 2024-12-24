const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['host', 'traveler'], required: true },
  bio: { type: String }, // Host-specific bio
  hostingPreferences: { type: String }, // E.g., solo travelers, small groups
  location: {
    generalAddress: { type: String, required: false }, // General area (e.g., "Downtown, San Diego, CA")
    geo: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number] }, // [longitude, latitude]
    },
  },
  airportPickup: { type: Boolean, default: false }, // Indicates if airport pickup is available
  lifestyle: {
    hobbies: { type: [String] }, // Array of hobbies
    dietaryPreferences: { type: String }, // Vegan, Halal, etc.
    smokingPolicy: { type: String }, // Allowed/Not Allowed
    drinkingPolicy: { type: String }, // Allowed/Not Allowed
    values: { type: [String] }, // Personal values (e.g., sustainability, family-oriented)
    politicalViews: { type: String }, // Optional political views
    activities: { type: [String] }, // Additional activities offered (e.g., hiking, art classes)
  },
  ratings: { type: Number, default: 0 }, // Average host rating
  verified: { type: Boolean, default: false }, // Verification status
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Export the User model
module.exports = mongoose.model('User', userSchema);
