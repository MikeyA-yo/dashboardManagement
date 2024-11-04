// Select necessary DOM elements
const registrationForm = document.getElementById("registrationForm");
const successMessage = document.getElementById("successMessage");
const loginLink = document.getElementById("loginLink");
const roomSelector = document.getElementById("roomSelector");

// User registration
registrationForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const user = { name, username, password };

  // I added this
  async function registerUser() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/users/register",
        {
          method: "post",
          body: JSON.stringify({ name, username, password }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
      // Because of the structure of the website storing this might be a bit complicated for me so I'll leave the frontend authentication in your hands...If you need assistance you can contact me
      if (!data.token) {
        throw new Error("Please register");
      }

      localStorage.setItem("token", data.token);
    } catch (err) {
      console.log(err);
    }
  }

  registerUser();

  localStorage.setItem("user", JSON.stringify(user));

  successMessage.textContent = `${name} was successfully registered!`;
  successMessage.style.display = "block";
  loginLink.style.display = "block";

  registrationForm.reset();
});

// Reset all users
function resetAllUsers() {
  localStorage.removeItem("user");
  alert("All users have been reset!");
}

// Load all rooms and populate the dropdown
async function loadRooms() {
  try {
    const response = await fetch("http://localhost:5000/api/rooms");
    if (!response.ok) throw new Error("Network response was not ok");

    const rooms = await response.json();
    localStorage.setItem("roomData", JSON.stringify(rooms)); // Cache in localStorage
    populateRoomSelector(rooms);
  } catch (error) {
    console.error("Error fetching room data from server:", error);
  }
}

// Populate room selector dropdown
function populateRoomSelector(rooms) {
  if (!roomSelector) return; // Ensure roomSelector exists
  roomSelector.innerHTML = ""; // Clear existing options
  rooms.forEach((room) => {
    const option = document.createElement("option");
    option.value = room._id; // Use room ID for selection
    option.textContent = `${room.type} - Room No: ${room.no}`;
    roomSelector.appendChild(option);
  });
}

// Load selected room details for editing
async function loadSelectedRoom(roomId) {
  if (!roomId) return; // If no room selected, do nothing
  try {
    const response = await fetch(`http://localhost:5000/api/rooms/${roomId}`);
    console.log(roomId);
    if (!response.ok) throw new Error("Network response was not ok");

    const roomData = await response.json();
    document.getElementById("roomType").value = roomData.type;
    document.getElementById("roomNo").value = roomData.no;
    document.getElementById("roomPrice").value = roomData.price;
    document.getElementById("roomId").value = roomData._id; // Store the room ID for updating
    document.getElementById("mainPhotoUpload").value = ""; // Reset file inputs for new selection
    document.getElementById("photoUpload1").value = "";
    document.getElementById("photoUpload2").value = "";
    document.getElementById("photoUpload3").value = "";
  } catch (error) {
    console.error("Error fetching selected room:", error);
  }
}

// Save or update room details
async function saveRoomDetails() {
  console.log("Saving room details...");

  const roomId = document.getElementById("roomId").value; // Get room ID
  const roomType = document.getElementById("roomType").value;
  const roomNo = document.getElementById("roomNo").value;
  const roomPrice = document.getElementById("roomPrice").value;

  const mainPhotoUpload = document.getElementById("mainPhotoUpload").files[0];
  const photoUpload1 = document.getElementById("photoUpload1").files[0];
  const photoUpload2 = document.getElementById("photoUpload2").files[0];
  const photoUpload3 = document.getElementById("photoUpload3").files[0];

  const formData = new FormData();
  formData.append("type", roomType);
  formData.append("no", roomNo);
  formData.append("price", roomPrice);

  if (mainPhotoUpload) {
    formData.append("mainPhoto", mainPhotoUpload);
  }
  if (photoUpload1) {
    formData.append("photo1", photoUpload1);
  }
  if (photoUpload2) {
    formData.append("photo2", photoUpload2);
  }
  if (photoUpload3) {
    formData.append("photo3", photoUpload3);
  }

  try {
    const url = roomId
      ? `http://localhost:5000/api/rooms/${roomId}`
      : "http://localhost:5000/api/rooms";

    const response = await fetch(url, {
      method: roomId ? "PUT" : "POST",
      body: formData,
    });

    console.log("Response status:", response.status); // Log response status

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Fetch error response:", errorText);
      throw new Error("Failed to save room details");
    }

    // Redirect to rooms.html to see the updated room
    window.location.href = "rooms.html";
  } catch (error) {
    console.error("Error:", error);
  }
}

// Call loadRooms on page load
window.onload = loadRooms;

// Event listener for room selector change
if (roomSelector) {
  roomSelector.addEventListener("change", function () {
    const selectedRoomId = this.value;
    loadSelectedRoom(selectedRoomId);
  });
}

// Add event listener to save button
const saveButton = document.getElementById("saveButton");
if (saveButton) {
  saveButton.addEventListener("click", saveRoomDetails);
}
