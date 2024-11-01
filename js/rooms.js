// Fetch room data from localStorage and display it
async function generateRoomList() {
    const roomsList = document.getElementById("rooms-list");
    if (!roomsList) {
        console.error("rooms-list element not found");
        return;
    }

    // Fetch rooms from localStorage
    const rooms = JSON.parse(localStorage.getItem('roomData')) || [];

    roomsList.innerHTML = ''; // Clear existing rooms
    rooms.forEach((room, index) => {
        const roomDiv = document.createElement("div");
        roomDiv.classList.add("room-item");

        roomDiv.innerHTML = `
            <img src="http://localhost:5000${room.mainPhoto || room.photos[0] || '/images/default-room.jpg'}" alt="Room ${index + 1} Main Photo" class="room-photo">
            <div class="room-info">
                <h2>Room ${index + 1}: ${room.type}</h2>
                <p>Room Number: ${room.no}</p>
                <p>Price: N${room.price}</p>
                <p>Status: <span id="roomStatus-${index}" class="status-span" style="color: ${applyStatusColor(room.status)};">${room.status}</span></p>
            </div>
            <div class="room-buttons">
                <button class="view-room-btn" onclick="viewRoomPhotos(${index})">View Room</button>
                <button class="book-room-btn" onclick="bookRoom(${index})">Book Room</button>
            </div>
            <div class="room-edit">
                <button class="edit-room-btn" onclick="editRoom('${room._id}')">Edit Room</button>
            </div>
            <div class="status-buttons">
                <button class="status-button available" onclick="updateRoomStatus(${index}, 'Available')">Available</button>
                <button class="status-button reserved" onclick="updateRoomStatus(${index}, 'Reserved')">Reserved</button>
                <button class="status-button booked" onclick="updateRoomStatus(${index}, 'Booked')">Booked</button>
            </div>
        `;
        roomsList.appendChild(roomDiv);
    });
}

// Function to apply color based on room status
function applyStatusColor(status) {
    switch (status) {
        case 'Available':
            return 'green'; // Example color for available rooms
        case 'Reserved':
            return 'yellow'; // Example color for reserved rooms
        case 'Booked':
            return 'red'; // Example color for booked rooms
        default:
            return 'gray'; // Default color for unknown status
    }
}

// Function to update room status
function updateRoomStatus(index, newStatus) {
    const rooms = JSON.parse(localStorage.getItem('roomData')) || [];
    if (rooms[index]) {
        rooms[index].status = newStatus; // Update the room status
        localStorage.setItem('roomData', JSON.stringify(rooms)); // Save updated rooms back to localStorage
        generateRoomList(); // Regenerate the room list to reflect changes
    }
}

// Function to edit room
function editRoom(roomId) {
    window.location.href = `admin.html?edit=${roomId}`; // Redirect to admin page with room ID to edit
}

// Call to generate room list on page load
window.onload = generateRoomList;


