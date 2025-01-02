const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS middleware
const path = require('path'); // Import path module
const userRoutes = require('./routes/userRoutes');
const hostRoutes = require('./routes/hostRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:8087' })); // Update origin for production
app.use(express.json());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/hosts', hostRoutes);

// Serve static files from the React app's build folder
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Catch-all handler for any requests that don’t match the API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// MongoDB Connection
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
