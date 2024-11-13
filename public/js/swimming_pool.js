let username = JSON.parse(localStorage.getItem("user")).username;
let currentUpdateId = ""
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
            hotelAccessories: accessories ? accessories : "",
            totalCost,
            date: new Date().toLocaleString()
        };
        swimmingPoolEntry.username = username
        swimmingPoolEntry._id = currentUpdateId
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

async function saveSwimmingPoolEntry(entry) {
    await fetch("/api/v1/pools",{
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body:JSON.stringify(entry)
    })
    window.location.reload()
    // const swimmingPoolEntries = JSON.parse(localStorage.getItem('swimmingPoolEntries')) || [];
    // swimmingPoolEntries.push(entry);
    // localStorage.setItem('swimmingPoolEntries', JSON.stringify(swimmingPoolEntries));
}

async function updateSwimmingPoolEntry(updatedEntry, index) {
    updatedEntry.edit = true
    await fetch("/api/v1/pools",{
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body:JSON.stringify(updatedEntry)
    })
      window.location.reload()
    // const swimmingPoolEntries = JSON.parse(localStorage.getItem('swimmingPoolEntries')) || [];
    // swimmingPoolEntries[index] = updatedEntry;
    // localStorage.setItem('swimmingPoolEntries', JSON.stringify(swimmingPoolEntries));
}

async function loadSwimmingPoolEntries() {
    const res = await fetch("/api/v1/pools")
    const data = await res.json()
    const swimmingPoolEntries = data || [];
    const tableBody = document.querySelector('#swimmingPoolTable tbody');
    tableBody.innerHTML = ''; // Clear previous entries

    swimmingPoolEntries.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.fullName}</td>
            <td>${entry.hours} Hour(s)</td>
            <td>${entry.hotelAccessories}</td>
            <td>${entry.totalCost}</td>
            <td>
                <button onclick="editSwimmingPoolEntry(${index})">Edit</button>
                <button onclick="printSwimmingPoolEntry(${index})">Print</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function editSwimmingPoolEntry(index) {
    const res = await fetch("/api/v1/pools")
    const data = await res.json()
    const swimmingPoolEntries = data || [];
    const entry = swimmingPoolEntries[index];
    if (entry.isPrint){
        alert("Can't edit after print")
        return
    }
    document.getElementById('fullName').value = entry.fullName;
    document.getElementById('hours').value = entry.hours;
    document.getElementById('accessories').value = entry.hotelAccessories;
    document.getElementById('totalCost').value = entry.totalCost;

    document.getElementById('swimmingPoolForm').dataset.editingIndex = index;
    currentUpdateId = entry._id
}

async function printSwimmingPoolEntry(index) {
    const res = await fetch("/api/v1/pools")
    const data = await res.json()
    const swimmingPoolEntries = data || [];
    const entry = swimmingPoolEntries[index];

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <h1>Montevar Hotel</h1>
        <h2>Swimming Pool Service Receipt</h2>
        <p><strong>Full Name:</strong> ${entry.fullName}</p>
        <p><strong>Hours:</strong> ${entry.hours} Hour(s)</p>
        <p><strong>Hotel Accessories:</strong> ${entry.hotelAccessories}</p>
        <p><strong>Total Cost:</strong> ${entry.totalCost}</p>
        <p><strong>Date:</strong> ${entry.date}</p>
        <hr>
        <button onclick="window.print()">Print</button>
        <button onclick="window.close()">Close</button>
    `);
    await fetch("/api/v1/pools",{
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body:JSON.stringify({edit:true, isPrint:true, _id:entry._id})
    })
    printWindow.document.close();
    printWindow.focus();
}
