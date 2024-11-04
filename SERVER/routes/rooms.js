const multer = require("multer");
const path = require("path");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../../uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage });

const router = require("express").Router();
const {
  getAllRooms,
  addRoom,
  getRoom,
  updateRoom,
} = require("../controllers/rooms");

// Add new room with images
router.post(
  "/",
  upload.fields([
    { name: "mainPhoto" },
    { name: "photo1" },
    { name: "photo2" },
    { name: "photo3" },
  ]),
  addRoom
);

// Fetch all rooms
router.get("/", getAllRooms);

// Fetch room by ID
router.get("/:id", getRoom);

// Update room by ID
router.put(
  "/:id",
  upload.fields([
    { name: "mainPhoto" },
    { name: "photo1" },
    { name: "photo2" },
    { name: "photo3" },
  ]),
  updateRoom
);

module.exports = router;
