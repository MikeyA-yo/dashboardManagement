// Fetch room data from localStorage and display it
async function generateRoomList() {
    const roomsList = document.getElementById("rooms-list");
    if (!roomsList) {
        console.error("rooms-list element not found");
        return;
    }

    // Fetch rooms from localStorage // we shall now use db;
    const res = await fetch("/api/rooms")
    const rooms = await res.json() || []
    // const rooms = JSON.parse(localStorage.getItem('roomData')) || [];

    roomsList.innerHTML = ''; // Clear existing rooms
    rooms.forEach((room, index) => {
        const roomDiv = document.createElement("div");
        roomDiv.classList.add("room-item");

        roomDiv.innerHTML = `
            <img src="${window.location.origin}${room.mainPhoto || room.photo1 || '/images/default-room.jpg'}" alt="Room ${index + 1} Main Photo" class="room-photo">
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
async function updateRoomStatus(index, newStatus) {
    const res = await fetch("/api/rooms")
    const rooms = await res.json() || [];
    if (rooms[index]) {
        rooms[index].status = newStatus; // Update the room status
         // Save updated rooms back to localStorage // db now
         await fetch(`/api/rooms/${rooms[index]._id}`, {
            method:"PUT",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify(rooms[index])
         })
         let status = document.getElementById(`roomStatus-${index}`)
         status.style.color = applyStatusColor(rooms[index].status)
         switch(status.style.color){
            case "green":
                status.textContent = "Available";
                break;
            case "yellow":
                status.textContent = "Reserved";   
                break;
            default:
                status.textContent = "Booked"     
         }
        //generateRoomList(); // Regenerate the room list to reflect changes
    }
}
//modal
let currentRoomId = null;
let currentIndex = 0;
let currentRoomPhotos = [];

async function viewRoomPhotos(roomId) {
    const res = await fetch("/api/rooms")
    const rooms = await res.json() || [];
    const roomData = rooms
    currentRoomId = roomId;
    currentIndex = 0;
    currentRoomPhotos =[ roomData[roomId].photo1, roomData[roomId].photo2, roomData[roomId].photo3];
    // console.log(roomData)
    const modalImage = document.getElementById("modalImage");
    modalImage.src = currentRoomPhotos[currentIndex];

    const modal = document.getElementById("photoModal");
    modal.style.display = "flex";
}
// Modal slider functionality
document.getElementById("nextBtn").addEventListener("click", function () {
    currentIndex = (currentIndex + 1) % currentRoomPhotos.length;
    document.getElementById("modalImage").src = currentRoomPhotos[currentIndex];
    });
    
    document.getElementById("prevBtn").addEventListener("click", function () {
    currentIndex = (currentIndex - 1 + currentRoomPhotos.length) % currentRoomPhotos.length;
    document.getElementById("modalImage").src = currentRoomPhotos[currentIndex];
    });
    
    // Close modal function
    function closeModal() {
    const modal = document.getElementById("photoModal");
    modal.style.display = "none";
}
async function bookRoom(roomId) {
    const res = await fetch("/api/rooms")
    const rooms = await res.json() || [];
    const roomData = rooms
    const room = roomData[roomId];
    const bookingURL = `bookings.html?roomType=${encodeURIComponent(room.type)}&roomNo=${encodeURIComponent(room.no)}&roomPrice=${encodeURIComponent(room.price)}`;
    window.location.href = bookingURL;
    }
// Function to edit room
function editRoom(roomId) {
    window.location.href = `admin.html?edit=${roomId}`; // Redirect to admin page with room ID to edit
}

// Call to generate room list on page load
window.onload = generateRoomList;


