document.addEventListener('DOMContentLoaded', function() {
    loadFoodEntries();  // Load stored entries on page load

    // Form submission handler
    document.getElementById('roomFoodForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const roomNo = document.getElementById('roomNo').value;
        const foodType = document.getElementById('foodType').value.split('\n');
        const beverage = document.getElementById('beverage').value.split('\n');
        const paymentMethod = document.getElementById('paymentMethod').value;
        const serviceLocation = document.getElementById('serviceLocation').value;
        const totalAmount = document.getElementById('totalAmount').value;

        const currentDate = new Date().toLocaleDateString();

        const editingIndex = document.getElementById('roomFoodForm').dataset.editingIndex;

        const foodEntry = {
            roomNo,
            foodType,
            beverage,
            paymentMethod,
            serviceLocation,
            totalAmount,
            date: currentDate
        };

        // Handle either new entry or update existing one
        if (editingIndex !== undefined && editingIndex !== "") {
            updateFoodEntry(foodEntry, parseInt(editingIndex));
            document.getElementById('roomFoodForm').dataset.editingIndex = "";
        } else {
            saveFoodEntry(foodEntry);
        }

        loadFoodEntries();
        exportToFoodReport(foodEntry); // Save data to food_report.html as well
        document.getElementById('roomFoodForm').reset();
    });
});

// Save food entry to localStorage
function saveFoodEntry(entry) {
    const foodEntries = JSON.parse(localStorage.getItem('foodEntries')) || [];
    foodEntries.push(entry);
    localStorage.setItem('foodEntries', JSON.stringify(foodEntries));
}

// Update an existing food entry
function updateFoodEntry(updatedEntry, index) {
    const foodEntries = JSON.parse(localStorage.getItem('foodEntries')) || [];
    foodEntries[index] = updatedEntry;
    localStorage.setItem('foodEntries', JSON.stringify(foodEntries));
}

// Load food entries from localStorage
function loadFoodEntries() {
    const foodEntries = JSON.parse(localStorage.getItem('foodEntries')) || [];
    const tableBody = document.querySelector('#foodTable tbody');
    tableBody.innerHTML = '';

    foodEntries.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.roomNo}</td>
            <td>${entry.foodType.join('<br>')}</td>
            <td>${entry.beverage.join('<br>')}</td>
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
function editEntry(index) {
    const foodEntries = JSON.parse(localStorage.getItem('foodEntries')) || [];
    const entry = foodEntries[index];

    document.getElementById('roomNo').value = entry.roomNo;
    document.getElementById('foodType').value = entry.foodType.join('\n');
    document.getElementById('beverage').value = entry.beverage.join('\n');
    document.getElementById('paymentMethod').value = entry.paymentMethod;
    document.getElementById('serviceLocation').value = entry.serviceLocation;
    document.getElementById('totalAmount').value = entry.totalAmount;

    document.getElementById('roomFoodForm').dataset.editingIndex = index;
}

// Print an entry for the 80mm mini printer with updated design
function printEntry(index) {
    const foodEntries = JSON.parse(localStorage.getItem('foodEntries')) || [];
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
        <p><strong>Room No:</strong> ${entry.roomNo}</p>
        <p><strong>Type of Food:</strong> ${entry.foodType.join('<br>')}</p>
        <p><strong>Beverage/Water:</strong> ${entry.beverage.join('<br>')}</p>
        <p><strong>Payment Method:</strong> ${entry.paymentMethod}</p>
        <p><strong>Service Location:</strong> ${entry.serviceLocation}</p>
        <p><strong>Total Amount:</strong> ${entry.totalAmount}</p>
        <p><strong>Date:</strong> ${entry.date}</p>
        <hr>
        <button onclick="window.print()">Print</button>
        <button onclick="window.close()">Close</button>
    `);

    printWindow.document.close();
    printWindow.focus();
}

// Export the food entry to food_report.html (save to localStorage)
function exportToFoodReport(entry) {
    const foodReportEntries = JSON.parse(localStorage.getItem('foodReportEntries')) || [];
    foodReportEntries.push(entry);
    localStorage.setItem('foodReportEntries', JSON.stringify(foodReportEntries));
    console.log("Food entry saved to foodReportEntries", foodReportEntries);  // Check if the data is saved
}
