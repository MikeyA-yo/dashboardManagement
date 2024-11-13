// Import required modules
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const dotenv = require("dotenv");
const connectdb = require("./SERVER/db/connectdb");
const fs = require("fs");

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// Import routers
const roomRouter = require("./SERVER/routes/rooms");
const userRouter = require("./SERVER/routes/users");
const bookingRouter = require("./SERVER/routes/bookings");
const drinksRouter = require("./SERVER/routes/drinks");
const eventRouter = require("./SERVER/routes/events");
const inventoryRouter = require("./SERVER/routes/inventory");
const poolRouter = require("./SERVER/routes/pools");
const laundryRouter = require("./SERVER/routes/laundry");
const foodRouter = require("./SERVER/routes/food");

// Import middleware
const adminAuthMiddleware = require("./SERVER/middleware/adminAuth");
const authMiddleware = require("./SERVER/middleware/auth");

// CORS configuration to allow frontend connection
const corsOptions = {
  origin: ["http://127.0.0.1:5500", "http://127.0.0.1:57353", "http://127.0.0.1:8080"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware for parsing JSON data and serving static files
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure `uploads` folder exists
const uploadFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Configure storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder); // Files will be stored in the "uploads" folder
  },
  filename: (req, file, cb) => {
    // Assign unique names to the uploaded files to avoid conflicts
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Define the room creation route with file uploads using multer middleware
app.post("/api/rooms", upload.fields([
  { name: "mainPhoto", maxCount: 1 },
  { name: "photo1", maxCount: 1 },
  { name: "photo2", maxCount: 1 },
  { name: "photo3", maxCount: 1 }
]), (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No files were uploaded.' });
  }
  next();
}, async (req, res) => {
  try {
    // Log the body and files to check the incoming data
    console.log("Request body:", req.body);
    console.log("Uploaded files:", req.files);

    const { type, no, price, status } = req.body;

    // Process file upload paths
    const mainPhoto = req.files["mainPhoto"] ? "/uploads/" + req.files["mainPhoto"][0].filename : null;
    const photo1 = req.files["photo1"] ? "/uploads/" + req.files["photo1"][0].filename : null;
    const photo2 = req.files["photo2"] ? "/uploads/" + req.files["photo2"][0].filename : null;
    const photo3 = req.files["photo3"] ? "/uploads/" + req.files["photo3"][0].filename : null;

    // Save room details in database
    const newRoom = { type, no, price, status, mainPhoto, photo1, photo2, photo3 };
    const savedRoom = await require("./SERVER/models/Room").create(newRoom);

    res.status(201).json({ message: "Room created successfully", room: savedRoom });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Failed to create room" });
  }
});

// Use routers for other endpoints
app.use("/api/rooms", roomRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/drinks", drinksRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/pools", poolRouter);
app.use("/api/v1/laundry", laundryRouter);
app.use("/api/v1/food", foodRouter);

// Connect to MongoDB and start the server
async function startServer(url, port) {
  await connectdb(url);
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

// Run server with environment variables for MongoDB URL and port
startServer(process.env.MONGO_URI, process.env.PORT || 5000);
