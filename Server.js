const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware to handle JSON request bodies and CORS
app.use(express.json());
app.use(cors());

const SECRET_KEY = 'my_super_secret_123!';

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/auctionDB')
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Encrypt password before saving it to the database
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

// Auction Item Schema
const auctionItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  currentBid: { type: Number, required: true },
  highestBidder: { type: String, default: '' },
  closingTime: { type: Date, required: true },
  isClosed: { type: Boolean, default: false },
});

const AuctionItem = mongoose.model('AuctionItem', auctionItemSchema);

// Middleware to verify token (authentication)
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' });
    req.user = user;
    next();
  });
};

// POST Route: Signup
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST Route: Signin
app.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id, username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ message: 'Signin successful', token });
});

// POST Route: Create Auction Item (Protected)
app.post('/auction', authenticate, async (req, res) => {
  try {
    const { itemName, description, startingBid, closingTime } = req.body;

    if (!itemName || !description || !startingBid || !closingTime) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newItem = new AuctionItem({
      itemName,
      description,
      currentBid: startingBid,
      highestBidder: '',
      closingTime,
    });

    await newItem.save();
    res.status(201).json({ message: 'Auction item created', item: newItem });
  } catch (error) {
    console.error('Auction Post Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST Route: Place Bid on Auction Item (Protected)
app.post('/bid/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { bid } = req.body;
    const item = await AuctionItem.findById(id);

    if (!item) return res.status(404).json({ message: 'Auction item not found' });

    if (item.isClosed) return res.status(400).json({ message: 'Auction is closed' });

    // Check if the auction time has passed
    if (new Date() > new Date(item.closingTime)) {
      item.isClosed = true;
      await item.save();
      return res.json({ message: 'Auction closed', winner: item.highestBidder });
    }

    if (bid > item.currentBid) {
      item.currentBid = bid;
      item.highestBidder = req.user.username;
      await item.save();
      res.json({ message: 'Bid successful', item });
    } else {
      res.status(400).json({ message: 'Bid too low' });
    }
  } catch (error) {
    console.error('Bidding Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET Route: Get All Auction Items
app.get('/auctions', async (req, res) => {
  try {
    const auctions = await AuctionItem.find();
    res.json(auctions);
  } catch (error) {
    console.error('Fetching Auctions Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET Route: Get Single Auction Item by ID
app.get('/auctions/:id', async (req, res) => {
  try {
    const auctionItem = await AuctionItem.findById(req.params.id);
    if (!auctionItem) return res.status(404).json({ message: 'Auction item not found' });
    res.json(auctionItem);
  } catch (error) {
    console.error('Fetching Auction Item Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE Route: Delete Auction Item (Protected)
app.delete('/auction/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const auctionItem = await AuctionItem.findByIdAndDelete(id);

    if (!auctionItem) return res.status(404).json({ message: 'Auction item not found' });

    res.json({ message: 'Auction item deleted successfully' });
  } catch (error) {
    console.error('Deleting Auction Item Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PUT Route: Edit Auction Item (Protected)
app.put('/auction/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { itemName, description, startingBid, closingTime } = req.body;

    const auctionItem = await AuctionItem.findById(id);
    if (!auctionItem) return res.status(404).json({ message: 'Auction item not found' });

    // Only allow edits if the auction isn't closed yet
    if (auctionItem.isClosed) {
      return res.status(400).json({ message: 'Auction is closed and cannot be edited' });
    }

    auctionItem.itemName = itemName || auctionItem.itemName;
    auctionItem.description = description || auctionItem.description;
    auctionItem.currentBid = startingBid || auctionItem.currentBid;
    auctionItem.closingTime = closingTime || auctionItem.closingTime;

    await auctionItem.save();
    res.json({ message: 'Auction item updated successfully', item: auctionItem });
  } catch (error) {
    console.error('Editing Auction Item Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(5001, () => {
  console.log('Server is running on port 5001');
});
