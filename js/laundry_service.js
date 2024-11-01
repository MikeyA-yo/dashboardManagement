document.addEventListener('DOMContentLoaded', function() {
    loadLaundryEntries();  // Load stored entries on page load

    document.getElementById('laundryForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const fullName = document.getElementById('fullName').value;
        const roomNo = document.getElementById('roomNo').value;
        const totalClothes = document.getElementById('totalClothes').value;
        const serviceType = document.getElementById('serviceType').value.split('\n');
        const paymentMethod = document.getElementById('paymentMethod').value;
        const totalAmount = document.getElementById('totalAmount').value;

        const currentDate = new Date().toLocaleDateString();

        const editingIndex = document.getElementById('laundryForm').dataset.editingIndex;

        const laundryEntry = {
            fullName,
            roomNo,
            totalClothes,
            serviceType,
            paymentMethod,
            totalAmount,
            date: currentDate
        };

        if (editingIndex !== undefined && editingIndex !== "") {
            updateLaundryEntry(laundryEntry, parseInt(editingIndex));
            document.getElementById('laundryForm').dataset.editingIndex = "";
        } else {
            saveLaundryEntry(laundryEntry);
        }

        loadLaundryEntries();
        exportToLaundryReport(laundryEntry);
        document.getElementById('laundryForm').reset();
    });
});

function saveLaundryEntry(entry) {
    const laundryEntries = JSON.parse(localStorage.getItem('laundryEntries')) || [];
    laundryEntries.push(entry);
    localStorage.setItem('laundryEntries', JSON.stringify(laundryEntries));
}

function updateLaundryEntry(updatedEntry, index) {
    const laundryEntries = JSON.parse(localStorage.getItem('laundryEntries')) || [];
    laundryEntries[index] = updatedEntry;
    localStorage.setItem('laundryEntries', JSON.stringify(laundryEntries));
}

function loadLaundryEntries() {
    const laundryEntries = JSON.parse(localStorage.getItem('laundryEntries')) || [];
    const tableBody = document.querySelector('#laundryTable tbody');
    tableBody.innerHTML = '';

    laundryEntries.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.fullName}</td>
            <td>${entry.roomNo}</td>
            <td>${entry.totalClothes}</td>
            <td>${entry.serviceType.join('<br>')}</td>
            <td>${entry.paymentMethod}</td>
            <td>${entry.totalAmount}</td>
            <td>${entry.date}</td>
            <td>
                <button onclick="editLaundryEntry(${index})">Edit</button>
                <button onclick="printLaundryEntry(${index})">Print</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function editLaundryEntry(index) {
    const laundryEntries = JSON.parse(localStorage.getItem('laundryEntries')) || [];
    const entry = laundryEntries[index];

    document.getElementById('fullName').value = entry.fullName;
    document.getElementById('roomNo').value = entry.roomNo;
    document.getElementById('totalClothes').value = entry.totalClothes;
    document.getElementById('serviceType').value = entry.serviceType.join('\n');
    document.getElementById('paymentMethod').value = entry.paymentMethod;
    document.getElementById('totalAmount').value = entry.totalAmount;

    document.getElementById('laundryForm').dataset.editingIndex = index;
}

function printLaundryEntry(index) {
    const laundryEntries = JSON.parse(localStorage.getItem('laundryEntries')) || [];
    const entry = laundryEntries[index];

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <h1>Montevar Hotel</h1>
        <h2>Laundry Service Receipt</h2>
        <p><strong>Full Name:</strong> ${entry.fullName}</p>
        <p><strong>Room No:</strong> ${entry.roomNo}</p>
        <p><strong>Total Clothes:</strong> ${entry.totalClothes}</p>
        <p><strong>Type of Services Provided:</strong> ${entry.serviceType.join('<br>')}</p>
        <p><strong>Payment Method:</strong> ${entry.paymentMethod}</p>
        <p><strong>Total Amount:</strong> ${entry.totalAmount}</p>
        <p><strong>Date:</strong> ${entry.date}</p>
        <hr>
        <button onclick="window.print()">Print</button>
        <button onclick="window.close()">Close</button>
    `);
    printWindow.document.close();
    printWindow.focus();
}

function exportToLaundryReport(entry) {
    const laundryReportEntries = JSON.parse(localStorage.getItem('laundryReportEntries')) || [];
    laundryReportEntries.push(entry);
    localStorage.setItem('laundryReportEntries', JSON.stringify(laundryReportEntries));
}
