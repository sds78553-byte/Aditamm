const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// ✅ Import Routes
const storeRoutes = require('./routes/storeRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes'); // 🆕 Cart routes

dotenv.config();
const app = express();

// 🔐 MongoDB URI + Port
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://DroppyCluster:Shubx7890%24@droppycluster.ocgxd0t.mongodb.net/droppyshop?retryWrites=true&w=majority';
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(cors());
app.use(express.json()); // parse JSON body

// ✅ MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Atlas connected successfully'))
.catch((err) => {
  console.error('❌ MongoDB connection failed:', err.message);
  process.exit(1);
});

// ✅ API Routes
app.use('/api/stores', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes); // 🆕 Connected cart APIs

// ✅ Health Check Route
app.get('/', (req, res) => {
  res.send('🚀 DroppyShop backend running on MongoDB Atlas!');
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is live at: http://localhost:${PORT}`);
});
