let editMode = false;
let currentUpdateId = ""
document.addEventListener('DOMContentLoaded', function() {
    loadDrinkEntries();  // Load stored entries on page load

    // Form submission handler
    document.getElementById('roomDrinkForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const roomNo = document.getElementById('roomNo').value;
        const drinkType = document.getElementById('drinkType').value;
        const beverage = document.getElementById('beverage').value;
        const paymentMethod = document.getElementById('paymentMethod').value;
        const serviceLocation = document.getElementById('serviceLocation').value;
        const totalAmount = document.getElementById('totalAmount').value;

        const currentDate = new Date().toLocaleDateString();

        const editingIndex = document.getElementById('roomDrinkForm').dataset.editingIndex;

        const drinkEntry = {
            roomNumber:roomNo,
            drinkType,
            beverageType:beverage,
            paymentMethod,
            serviceLocation,
            totalAmount,
            username:JSON.parse(localStorage.getItem("user")).username,
            date: currentDate
        };

        // Handle either new entry or update existing one
        drinkEntry._id = currentUpdateId;
        if (editMode) {
            updateDrinkEntry(drinkEntry, parseInt(editingIndex));
            document.getElementById('roomDrinkForm').dataset.editingIndex = "";
            editMode = false
        } else {
            saveDrinkEntry(drinkEntry);
        }

        loadDrinkEntries();
        // exportToDrinkReport(drinkEntry); // Save data to drink_report.html as well // we have a db bruh
        document.getElementById('roomDrinkForm').reset();
    });
});

// Save drink entry to localStorage
async function saveDrinkEntry(entry) {
    const res = await fetch ("/api/v1/drinks", {
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body: JSON.stringify(entry)
    })
    window.location.reload()
    // const drinkEntries = JSON.parse(localStorage.getItem('drinkEntries')) || [];
    // drinkEntries.push(entry);
    // localStorage.setItem('drinkEntries', JSON.stringify(drinkEntries));
}

// Update an existing drink entry
async function updateDrinkEntry(updatedEntry, index) {
    updatedEntry.edit = true;
    const res = await fetch ("/api/v1/drinks", {
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body: JSON.stringify(updatedEntry)
    })
    window.location.reload()
    // const drinkEntries = JSON.parse(localStorage.getItem('drinkEntries')) || [];
    // drinkEntries[index] = updatedEntry;
    // localStorage.setItem('drinkEntries', JSON.stringify(drinkEntries));
}

// Load drink entries from localStorage
async function loadDrinkEntries() {
    const res = await fetch("/api/v1/drinks");
    const drinks = await res.json()
    const drinkEntries = drinks.drinks || [];
    const tableBody = document.querySelector('#drinkTable tbody');
    tableBody.innerHTML = '';
    
    drinkEntries.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.roomNumber}</td>
            <td>${entry.drinkType}</td>
            <td>${entry.beverageType}</td>
            <td>${entry.paymentMethod}</td>
            <td>${entry.serviceLocation}</td>
            <td>${entry.totalAmount}</td>
            <td>${entry.date}</td>
            <td>
                <button onclick="editDrinkEntry(${index})">Edit</button>
                <button onclick="printDrinkEntry(${index})">Print</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Edit a drink entry
async function editDrinkEntry(index) {
    const res = await fetch("/api/v1/drinks");
    const drinks = await res.json()
    const drinkEntries = drinks.drinks || [];
    const entry = drinkEntries[index];
    if(entry.isPrint){
        alert("Can't edit after print")
        return
    }
    document.getElementById('roomNo').value = entry.roomNumber;
    document.getElementById('drinkType').value = entry.drinkType;
    document.getElementById('beverage').value = entry.beverageType;
    document.getElementById('paymentMethod').value = entry.paymentMethod;
    document.getElementById('serviceLocation').value = entry.serviceLocation;
    document.getElementById('totalAmount').value = entry.totalAmount;

    document.getElementById('roomDrinkForm').dataset.editingIndex = index;
    editMode = true
    currentUpdateId = entry._id
}

// Print a drink entry for the 80mm mini printer
// Print a drink entry for the 80mm mini printer
async function printDrinkEntry(index) {
    const res = await fetch("/api/v1/drinks");
    const drinks = await res.json()
    const drinkEntries = drinks.drinks || [];
    const entry = drinkEntries[index];

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
        <h2>Drink & Beverage Receipt</h2>
        <p><strong>Room No:</strong> ${entry.roomNumber}</p>
        <p><strong>Type of Drink:</strong> ${entry.drinkType}</p>
        <p><strong>Beverage Type:</strong> ${entry.beverageType}p>
        <p><strong>Payment Method:</strong> ${entry.paymentMethod}</p>
        <p><strong>Service Location:</strong> ${entry.serviceLocation}</p>
        <p><strong>Total Amount:</strong> ${entry.totalAmount}</p>
        <p><strong>Date:</strong> ${entry.date}</p>
        <hr>
        <button onclick="window.print()">Print</button>
        <button onclick="window.close()">Close</button>
    `);
    await fetch ("/api/v1/drinks", {
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body: JSON.stringify({isPrint:true, edit:true, _id:entry._id})
    })
    printWindow.document.close();
    printWindow.focus();
}


// Export the drink entry to drink_report.html (save to localStorage)
function exportToDrinkReport(entry) {
    const drinkReportEntries = JSON.parse(localStorage.getItem('drinkReportEntries')) || [];
    drinkReportEntries.push(entry);
    localStorage.setItem('drinkReportEntries', JSON.stringify(drinkReportEntries));
    console.log("Drink entry saved to drinkReportEntries", drinkReportEntries);  // Check if the data is saved
}
