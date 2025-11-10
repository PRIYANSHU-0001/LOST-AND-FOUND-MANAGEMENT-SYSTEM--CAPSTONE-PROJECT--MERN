require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());

// Uploads folder se static files serve karne ke liye
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import item routes
const itemRoutes = require('./src/routes/itemRoutes');
app.use('/api/items', itemRoutes);

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected (Item Service)'))
  .catch(err => console.error('MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('Item Service is running');
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Item service running on port ${PORT}`));
