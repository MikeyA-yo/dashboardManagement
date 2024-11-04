const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const roomRouter = require("./routes/rooms");
const userRouter = require("./routes/users");
const bookingRouter = require("./routes/bookings");
const drinksRouter = require("./routes/drinks");
const eventRouter = require("./routes/events");
const inventoryRouter = require("./routes/inventory");
const poolRouter = require("./routes/pools");
const laundryRouter = require("./routes/laundry");
const foodRouter = require("./routes/food");

const connectdb = require("./db/connectdb");

// Custom middleware imports
const adminAuthMiddleware = require("./middleware/adminAuth");
const authMiddleware = require("./middleware/auth");

// NOTE: I recreated the entire folder structure to match the MVC architecture (Recommended by most companies🗒️)

// Configuration to allow use of environment variables from the .env file in the folder
require("dotenv").config();

// CORS options for frontend connection
const corsOptions = {
  origin: ["http://127.0.0.1:5500", "http://127.0.0.1:57353"],
  // origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes

//////////////////////////////

// NOTE: call middleware in the right order, for routes for the admin middleware you should call the adminAuthMiddleware before the authMiddleware

// app.use("/api/rooms", authMiddleware, roomRouter);

/////////////////////////////
app.use("/api/rooms", roomRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/drinks", drinksRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/pools", poolRouter);
app.use("/api/v1/laundry", laundryRouter);
app.use("/api/v1/food", foodRouter);

// MongoDB connection & Server setup

function startServer(url, port) {
  connectdb(url);

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

// Running the server and connecting the DB
startServer(process.env.MONGO_URI, process.env.PORT);
