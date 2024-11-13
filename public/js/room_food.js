let username = JSON.parse(localStorage.getItem("user")).username;
let currentUpdateId = ""
document.addEventListener('DOMContentLoaded', function() {
    loadFoodEntries();  // Load stored entries on page load

    // Form submission handler
    document.getElementById('roomFoodForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const roomNo = document.getElementById('roomNo').value;
        const foodType = document.getElementById('foodType').value;
        const beverage = document.getElementById('beverage').value;
        const paymentMethod = document.getElementById('paymentMethod').value;
        const serviceLocation = document.getElementById('serviceLocation').value;
        const totalAmount = document.getElementById('totalAmount').value;

        const currentDate = new Date().toLocaleDateString();

        const editingIndex = document.getElementById('roomFoodForm').dataset.editingIndex;

        const foodEntry = {
            roomNumber:roomNo,
            typeOfFood:foodType,
            beverageOrWater:beverage,
            paymentMethod,
            serviceLocation,
            totalAmount,
            date: currentDate
        };
        foodEntry._id = currentUpdateId
        // Handle either new entry or update existing one
        if (editingIndex !== undefined && editingIndex !== "") {
            updateFoodEntry(foodEntry, parseInt(editingIndex));
            document.getElementById('roomFoodForm').dataset.editingIndex = "";
        } else {
            saveFoodEntry(foodEntry);
        }

        loadFoodEntries();
        // exportToFoodReport(foodEntry); // Save data to food_report.html as well //don't worry we have a db now
        document.getElementById('roomFoodForm').reset();
    });
});

// Save food entry to localStorage
async function saveFoodEntry(entry) {
    entry.username = username
    await fetch("/api/v1/food",{
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body: JSON.stringify(entry)
    })
    window.location.reload()
    // const foodEntries = JSON.parse(localStorage.getItem('foodEntries')) || [];
    // foodEntries.push(entry);
    // localStorage.setItem('foodEntries', JSON.stringify(foodEntries));
}

// Update an existing food entry
async function updateFoodEntry(updatedEntry, index) {
    updatedEntry.edit = true;
    updatedEntry.username = username
    await fetch("/api/v1/food",{
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body: JSON.stringify(updatedEntry)
    })
    window.location.reload()
    // const foodEntries = JSON.parse(localStorage.getItem('foodEntries')) || [];
    // foodEntries[index] = updatedEntry;
    // localStorage.setItem('foodEntries', JSON.stringify(foodEntries));
}

// Load food entries from localStorage
async function loadFoodEntries() {
    const res = await fetch("api/v1/food");
    const jsondata = await res.json()
    const foodEntries = jsondata.foods || [];
    const tableBody = document.querySelector('#foodTable tbody');
    tableBody.innerHTML = '';

    foodEntries.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.roomNumber}</td>
            <td>${entry.typeOfFood}</td>
            <td>${entry.beverageOrWater}</td>
            <td>${entry.paymentMethod}</td>
            <td>${entry.serviceLocation}</td>
            <td>${entry.totalAmount}</td>
            <td>${entry.date}</td>
            <td>
                <button onclick="editEntry(${index})">Edit</button>
                <button onclick="printEntry(${index})">Print</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Edit an entry
async function editEntry(index) {
    const res = await fetch("api/v1/food");
    const jsondata = await res.json()
    const foodEntries = jsondata.foods || [];
    const entry = foodEntries[index]
    if(entry.isPrint){
        alert("Can't edit after print");
        return;
    }
    document.getElementById('roomNo').value = entry.roomNumber;
    document.getElementById('foodType').value = entry.typeOfFood;
    document.getElementById('beverage').value = entry.beverageOrWater;
    document.getElementById('paymentMethod').value = entry.paymentMethod;
    document.getElementById('serviceLocation').value = entry.serviceLocation;
    document.getElementById('totalAmount').value = entry.totalAmount;

    document.getElementById('roomFoodForm').dataset.editingIndex = index;
    currentUpdateId = entry._id
}

// Print an entry for the 80mm mini printer with updated design
async function printEntry(index) {
    const res = await fetch("api/v1/food");
    const jsondata = await res.json()
    const foodEntries = jsondata.foods || [];
    const entry = foodEntries[index];

    const printWindow = window.open('', '', 'width=800,height=600');
    
    printWindow.document.write(`
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
            }
            h1, h2 {
                text-align: left;
                margin-bottom: 10px;
            }
            p {
                
                text-align: left;
                margin: 8px 0;
            }
            hr {
                border: 1px solid #ccc;
            }
            button {
                margin-top: 20px;
            }
        </style>
        <h1>Montevar Hotel</h1>
        <h2>Food & Beverage Receipt</h2>
        <p><strong>Room No:</strong> ${entry.roomNumber}</p>
        <p><strong>Type of Food:</strong> ${entry.typeOfFood}</p>
        <p><strong>Beverage/Water:</strong> ${entry.beverageOrWater}</p>
        <p><strong>Payment Method:</strong> ${entry.paymentMethod}</p>
        <p><strong>Service Location:</strong> ${entry.serviceLocation}</p>
        <p><strong>Total Amount:</strong> ${entry.totalAmount}</p>
        <p><strong>Date:</strong> ${entry.date}</p>
        <hr>
        <button onclick="window.print()">Print</button>
        <button onclick="window.close()">Close</button>
    `);
    await fetch("/api/v1/food",{
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body: JSON.stringify({isPrint:true,edit:true, _id:entry._id})
    })
    printWindow.document.close();
    printWindow.focus();
}

// Export the food entry to food_report.html (save to localStorage)
// function exportToFoodReport(entry) {
//     const foodReportEntries = JSON.parse(localStorage.getItem('foodReportEntries')) || [];
//     foodReportEntries.push(entry);
//     localStorage.setItem('foodReportEntries', JSON.stringify(foodReportEntries));
//     console.log("Food entry saved to foodReportEntries", foodReportEntries);  // Check if the data is saved
// }
