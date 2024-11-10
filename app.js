const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const roomRouter = require("./SERVER/routes/rooms");
const userRouter = require("./SERVER/routes/users");
const bookingRouter = require("./SERVER/routes/bookings");
const drinksRouter = require("./SERVER/routes/drinks");
const eventRouter = require("./SERVER/routes/events");
const inventoryRouter = require("./SERVER/routes/inventory");
const poolRouter = require("./SERVER/routes/pools");
const laundryRouter = require("./SERVER/routes/laundry");
const foodRouter = require("./SERVER/routes/food");

const connectdb = require("./SERVER/db/connectdb");

// Custom middleware imports
const adminAuthMiddleware = require("./SERVER/middleware/adminAuth");
const authMiddleware = require("./SERVER/middleware/auth");

// NOTE: I recreated the entire folder structure to match the MVC architecture (Recommended by most companies🗒️)

// Configuration to allow use of environment variables from the .env file in the folder
require("dotenv").config();

// CORS options for frontend connection
const corsOptions = {
  //edit origin later
  //["http://127.0.0.1:5500", "http://127.0.0.1:57353"]
  origin: ["http://127.0.0.1:5500", "http://127.0.0.1:57353", "http://127.0.0.1:8080"] ,
  // origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("public"))
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes

//////////////////////////////

// NOTE: call middleware in the right order, for routes for the admin middleware you should call the adminAuthMiddleware before the authMiddleware

// app.use("/api/rooms", authMiddleware, roomRouter);

/////////////////////////////
app.use("/api/rooms", roomRouter); // partial done
app.use("/api/v1/users", userRouter); // done
app.use("/api/v1/bookings", bookingRouter); // done
app.use("/api/v1/drinks", drinksRouter); // done
app.use("/api/v1/events", eventRouter); // done
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/pools", poolRouter); //done
app.use("/api/v1/laundry", laundryRouter); // done
app.use("/api/v1/food", foodRouter); // done

// MongoDB connection & Server setup

function startServer(url, port) {
  connectdb(url);

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

// Running the server and connecting the DB
startServer(process.env.MONGO_URI, process.env.PORT);
