const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS middeleware
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const hostRoutes = require('./routes/hostRoutes'); // Import host routes
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:8088' })); // Allow requests only from your frontend
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/hosts', hostRoutes); // Register host routes

// Serve static files from React app
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Catch all handler for any requests that don't match the API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/frontend/build/index.html'));
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
