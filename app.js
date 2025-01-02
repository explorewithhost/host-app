const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const hostRoutes = require('./routes/hostRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:8081'], // Allow multiple frontend origins
  optionsSuccessStatus: 200, // For legacy browsers
};
app.use(cors(corsOptions));

// JSON Parser
app.use(express.json());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/hosts', hostRoutes);

// Serve Frontend Build Files (if deployed)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
  });
}

// MongoDB Connection
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
