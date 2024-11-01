const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const multer = require('multer');
const path = require('path');
const app = express();
const port = 5000;

// CORS options for frontend connection
const corsOptions = {
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect('mongodb+srv://montevarhotels:mOTPtjIpaA41boaz@cluster0.zqedj.mongodb.net/montevar?retryWrites=true&w=majority')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('MongoDB connection error:', err));

// Define Room schema
const roomSchema = new mongoose.Schema({
    type: { type: String, required: true },
    no: { type: String, required: true },
    price: { type: String, required: true },
    mainPhoto: String,
    photo1: String,
    photo2: String,
    photo3: String,
    status: { type: String, default: 'Available' }
});
const RoomModel = mongoose.model('Room', roomSchema);

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

// Add new room with images
app.post('/api/rooms', upload.fields([
    { name: 'mainPhoto' },
    { name: 'photo1' },
    { name: 'photo2' },
    { name: 'photo3' }
]), async (req, res) => {
    const { type, no, price } = req.body;

    const roomData = new RoomModel({
        type,
        no,
        price,
        mainPhoto: req.files['mainPhoto'] ? `/uploads/${req.files['mainPhoto'][0].filename}` : null,
        photo1: req.files['photo1'] ? `/uploads/${req.files['photo1'][0].filename}` : null,
        photo2: req.files['photo2'] ? `/uploads/${req.files['photo2'][0].filename}` : null,
        photo3: req.files['photo3'] ? `/uploads/${req.files['photo3'][0].filename}` : null,
    });

    try {
        await roomData.save();
        res.status(201).send('Room added successfully');
    } catch (error) {
        res.status(400).send('Error saving room: ' + error.message);
    }
});

// Fetch all rooms
app.get('/api/rooms', async (req, res) => {
    try {
        const rooms = await RoomModel.find({});
        res.json(rooms);
    } catch (error) {
        res.status(500).send('Error fetching rooms: ' + error.message);
    }
});

// Fetch room by ID
app.get('/api/rooms/:id', async (req, res) => {
    try {
        const room = await RoomModel.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch room', error: error.message });
    }
});

// Update room by ID
app.put('/api/rooms/:id', upload.fields([
    { name: 'mainPhoto' },
    { name: 'photo1' },
    { name: 'photo2' },
    { name: 'photo3' }
]), async (req, res) => {
    const roomId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return res.status(400).json({ message: 'Invalid room ID' });
    }

    try {
        const updatedRoomData = {
            type: req.body.type,
            no: req.body.no,
            price: req.body.price,
            mainPhoto: req.files['mainPhoto'] ? `/uploads/${req.files['mainPhoto'][0].filename}` : undefined,
            photo1: req.files['photo1'] ? `/uploads/${req.files['photo1'][0].filename}` : undefined,
            photo2: req.files['photo2'] ? `/uploads/${req.files['photo2'][0].filename}` : undefined,
            photo3: req.files['photo3'] ? `/uploads/${req.files['photo3'][0].filename}` : undefined,
        };

        const updatedRoom = await RoomModel.findByIdAndUpdate(roomId, updatedRoomData, { new: true });

        if (!updatedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(200).json({ message: 'Room updated successfully', room: updatedRoom });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update room', error: error.message });
    }
});

// Server setup
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
