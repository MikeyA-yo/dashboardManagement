document.addEventListener('DOMContentLoaded', function() {
    loadSwimmingPoolEntries(); // Load entries on page load

    // Handle form submission
    document.getElementById('swimmingPoolForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const fullName = document.getElementById('fullName').value;
        const hours = document.getElementById('hours').value;
        const accessories = document.getElementById('accessories').value;
        const totalCost = document.getElementById('totalCost').value;

        const editingIndex = document.getElementById('swimmingPoolForm').dataset.editingIndex;

        const swimmingPoolEntry = {
            fullName,
            hours,
            accessories: accessories ? accessories.split('\n') : [],
            totalCost,
            date: new Date().toLocaleString()
        };

        if (editingIndex !== undefined && editingIndex !== "") {
            updateSwimmingPoolEntry(swimmingPoolEntry, parseInt(editingIndex));
            document.getElementById('swimmingPoolForm').dataset.editingIndex = "";
        } else {
            saveSwimmingPoolEntry(swimmingPoolEntry);
        }

        loadSwimmingPoolEntries();
        document.getElementById('swimmingPoolForm').reset();
    });
});

function saveSwimmingPoolEntry(entry) {
    const swimmingPoolEntries = JSON.parse(localStorage.getItem('swimmingPoolEntries')) || [];
    swimmingPoolEntries.push(entry);
    localStorage.setItem('swimmingPoolEntries', JSON.stringify(swimmingPoolEntries));
}

function updateSwimmingPoolEntry(updatedEntry, index) {
    const swimmingPoolEntries = JSON.parse(localStorage.getItem('swimmingPoolEntries')) || [];
    swimmingPoolEntries[index] = updatedEntry;
    localStorage.setItem('swimmingPoolEntries', JSON.stringify(swimmingPoolEntries));
}

function loadSwimmingPoolEntries() {
    const swimmingPoolEntries = JSON.parse(localStorage.getItem('swimmingPoolEntries')) || [];
    const tableBody = document.querySelector('#swimmingPoolTable tbody');
    tableBody.innerHTML = ''; // Clear previous entries

    swimmingPoolEntries.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.fullName}</td>
            <td>${entry.hours} Hour(s)</td>
            <td>${entry.accessories.join('<br>')}</td>
            <td>${entry.totalCost}</td>
            <td>
                <button onclick="editSwimmingPoolEntry(${index})">Edit</button>
                <button onclick="printSwimmingPoolEntry(${index})">Print</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function editSwimmingPoolEntry(index) {
    const swimmingPoolEntries = JSON.parse(localStorage.getItem('swimmingPoolEntries')) || [];
    const entry = swimmingPoolEntries[index];

    document.getElementById('fullName').value = entry.fullName;
    document.getElementById('hours').value = entry.hours;
    document.getElementById('accessories').value = entry.accessories.join('\n');
    document.getElementById('totalCost').value = entry.totalCost;

    document.getElementById('swimmingPoolForm').dataset.editingIndex = index;
}

function printSwimmingPoolEntry(index) {
    const swimmingPoolEntries = JSON.parse(localStorage.getItem('swimmingPoolEntries')) || [];
    const entry = swimmingPoolEntries[index];

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <h1>Montevar Hotel</h1>
        <h2>Swimming Pool Service Receipt</h2>
        <p><strong>Full Name:</strong> ${entry.fullName}</p>
        <p><strong>Hours:</strong> ${entry.hours} Hour(s)</p>
        <p><strong>Hotel Accessories:</strong> ${entry.accessories.join('<br>')}</p>
        <p><strong>Total Cost:</strong> ${entry.totalCost}</p>
        <p><strong>Date:</strong> ${entry.date}</p>
        <hr>
        <button onclick="window.print()">Print</button>
        <button onclick="window.close()">Close</button>
    `);
    printWindow.document.close();
    printWindow.focus();
}
