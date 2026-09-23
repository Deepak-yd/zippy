const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // .env file ko read karne ke liye

const app = express();
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const corsOriginDelegate = (origin, callback) => {
  if (!origin) return callback(null, true);
  if (
    origin.endsWith('.vercel.app') ||
    origin.startsWith('http://localhost') ||
    (process.env.FRONTEND_URL && origin.replace(/\/$/, '') === process.env.FRONTEND_URL.replace(/\/$/, ''))
  ) {
    return callback(null, true);
  }
  callback(null, true);
};

const io = new Server(server, {
  cors: {
    origin: corsOriginDelegate,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  }
});

// Socket.io logic
io.on('connection', (socket) => {
  console.log('🟢 A user connected');
  
  // Jab customer payment karega, ye track-order event trigger hoga
  socket.on('track-order', (orderId) => {
    console.log(`Order ${orderId} placed successfully.`);
  });
});
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors({
  origin: corsOriginDelegate,
  credentials: true
}));
app.use(express.json());

// Upload folder ko public banana (Taki frontend me images dikh sake)
app.use('/uploads', express.static('uploads'));
// Routes Import
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// YAHAN NAYA ROUTE ADD KARO 👇
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

// YAHAN NAYA ORDERS ROUTE ADD KARO 👇
const orderRoutes = require('./routes/orders');
app.use('/api/orders', orderRoutes);

//PAYMENT ROUTE
const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);

//ADMIN ROUTE
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);
// ========================================

// ==========================================
// 1. MONGODB DATABASE CONNECTION
// ==========================================
const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.log('⚠️ MONGO_URI not specified. Initializing in-memory MongoDB server...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log('💡 In-memory MongoDB running at:', mongoUri);
    }
    await mongoose.connect(mongoUri);
    console.log('✅☁️ MongoDB Database Connected Successfully!');
    await seedInitialProducts();
  } catch (error) {
    console.log('❌ MongoDB Connection Error:', error.message);
  }
};

const seedInitialProducts = async () => {
  try {
    const Product = require('./models/Product');
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding initial products database...');
      await Product.insertMany([
        {
          title: "Parle Hide and Seek Chocolate Chip Cookies, 200g",
          price: 44,
          imagePath: "https://res.cloudinary.com/duhokqw0j/image/upload/v1782300572/zippy_products/ema7m8ohxy4xvaecrlvh.jpg",
          category: "School Time",
          sellerId: "6a3b7a76f70fd7a54141f5bb"
        },
        {
          title: "Cadbury Dairy Milk Silk Roast Almond Chocolate Bars, 52 g",
          price: 83,
          imagePath: "https://res.cloudinary.com/duhokqw0j/image/upload/v1782296896/zippy_products/znn0vznou1wtsqal3cxa.jpg",
          category: "School Time",
          sellerId: "6a3bb04fc41f74925d86e04c"
        },
        {
          title: "Cadbury Dairy Milk Chocolate Maha Pack, 52 Grams",
          price: 40,
          imagePath: "https://res.cloudinary.com/duhokqw0j/image/upload/v1782296604/zippy_products/zzh3xq707dihyiffbvup.jpg",
          category: "School Time",
          sellerId: "6a3b7a76f70fd7a54141f5bb"
        },
        {
          title: "Lays Potato Chips - American Style Cream & Onion 26.5/30.5g",
          price: 10,
          imagePath: "https://res.cloudinary.com/duhokqw0j/image/upload/v1782230801/zippy_products/eg7c98y29nu1apyaa8ru.jpg",
          category: "Grocery",
          sellerId: "6a39661d418e93be6508ebdc"
        },
        {
          title: "Lays Classic Salted Potato Chips, 37.5g/26.5g/28g/29g",
          price: 10,
          imagePath: "https://res.cloudinary.com/duhokqw0j/image/upload/v1782234835/zippy_products/own1ablw1ltmc5kdxpl8.jpg",
          category: "Grocery",
          sellerId: "6a39661d418e93be6508ebdc"
        },
        {
          title: "Surf Excel Easy Wash Detergent Powder 7 kg",
          price: 730,
          imagePath: "https://res.cloudinary.com/duhokqw0j/image/upload/v1782234854/zippy_products/d4d9zctm2pkwkzwohbik.jpg",
          category: "Home",
          sellerId: "6a39661d418e93be6508ebdc"
        },
        {
          title: "Dettol Liquid Handwash Refill – Skincare Hand Wash- 1350ml",
          price: 179,
          imagePath: "https://res.cloudinary.com/duhokqw0j/image/upload/v1782234877/zippy_products/mqvbvixglbxqaxq6y1tp.jpg",
          category: "Beauty",
          sellerId: "6a39661d418e93be6508ebdc"
        },
        {
          title: "Pears Original Glycerin Soap Bar - Pack of 8",
          price: 414,
          imagePath: "https://res.cloudinary.com/duhokqw0j/image/upload/v1782234963/zippy_products/ylb1p0jamji6c94svf1n.jpg",
          category: "Beauty",
          sellerId: "6a39661d418e93be6508ebdc"
        },
        {
          title: "MAGGI 2-Minute Instant Noodles, 75g",
          price: 14,
          imagePath: "https://res.cloudinary.com/duhokqw0j/image/upload/v1782235038/zippy_products/u3kgbqenkte1tm1gjkug.jpg",
          category: "Grocery",
          sellerId: "6a39661d418e93be6508ebdc"
        },
        {
          title: "Sunfeast Dark Fantasy Yumfills Whoopie Pie, 253g",
          price: 96,
          imagePath: "https://res.cloudinary.com/duhokqw0j/image/upload/v1782235069/zippy_products/bct82sbmhkinmrueuqjj.jpg",
          category: "Grocery",
          sellerId: "6a39661d418e93be6508ebdc"
        },
        {
          title: "Thums Up Soft Drink Pet Bottle, 750 Ml",
          price: 33,
          imagePath: "https://res.cloudinary.com/duhokqw0j/image/upload/v1782235098/zippy_products/vju4oizal0z8cekq6qcy.jpg",
          category: "Grocery",
          sellerId: "6a39661d418e93be6508ebdc"
        },
        {
          title: "7UP Extra Fizz, 400 Ml",
          price: 20,
          imagePath: "https://res.cloudinary.com/duhokqw0j/image/upload/v1782235132/zippy_products/a9feltniqx0vpo9j74t7.jpg",
          category: "Grocery",
          sellerId: "6a39661d418e93be6508ebdc"
        },
        {
          title: "Fortune Premium Kachi Ghani Pure Mustard Oil, 1 ltr",
          price: 182,
          imagePath: "https://res.cloudinary.com/duhokqw0j/image/upload/v1782269469/zippy_products/refqrbcsdvegmhlskhrh.jpg",
          category: "Grocery",
          sellerId: "6a39661d418e93be6508ebdc"
        }
      ]);
      console.log('✅ Initial product list seeded successfully!');
    }
  } catch (err) {
    console.error('Failed to seed initial products:', err.message);
  }
};

connectDB();

// ==========================================
// 2. BASIC ROUTE & HEALTH CHECK
// ==========================================
app.get('/', (req, res) => {
    res.send("Zippy Backend is Live with Database! 🚀");
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Server & WebSockets Start
server.listen(PORT, () => {
    console.log(`✅ Zippy Server & WebSockets running on http://localhost:${PORT}`);
});