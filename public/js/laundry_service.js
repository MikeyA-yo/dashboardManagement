let username = JSON.parse(localStorage.getItem("user")).username;
let currentUpdateId = ""
document.addEventListener('DOMContentLoaded', function() {
    loadLaundryEntries();  // Load stored entries on page load

    document.getElementById('laundryForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const fullName = document.getElementById('fullName').value;
        const roomNo = document.getElementById('roomNo').value;
        const totalClothes = document.getElementById('totalClothes').value;
        const serviceType = document.getElementById('serviceType').value;
        const paymentMethod = document.getElementById('paymentMethod').value;
        const totalAmount = document.getElementById('totalAmount').value;

        const currentDate = new Date().toLocaleDateString();

        const editingIndex = document.getElementById('laundryForm').dataset.editingIndex;

        const laundryEntry = {
            fullName,
            roomNumber:roomNo,
            numberOfClothes:totalClothes,
            typeOfService:serviceType,
            paymentMethod,
            totalAmount,
            date: currentDate
        };
        laundryEntry.username = username
        laundryEntry._id = currentUpdateId
        if (editingIndex !== undefined && editingIndex !== "") {
            updateLaundryEntry(laundryEntry, parseInt(editingIndex));
            document.getElementById('laundryForm').dataset.editingIndex = "";
        } else {
            saveLaundryEntry(laundryEntry);
        }

        loadLaundryEntries();
         // exportToLaundryReport(laundryEntry);
        document.getElementById('laundryForm').reset();
    });
});

async function saveLaundryEntry(entry) {
    await fetch("/api/v1/laundry",{
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body: JSON.stringify(entry)
    })
    window.location.reload()
    // const laundryEntries = JSON.parse(localStorage.getItem('laundryEntries')) || [];
    // laundryEntries.push(entry);
    // localStorage.setItem('laundryEntries', JSON.stringify(laundryEntries));
}

async function updateLaundryEntry(updatedEntry, index) {
    if (updatedEntry.isPrint){
        alert("Can't edit after a print")
        return
    }
    updatedEntry.edit = true
    await fetch("/api/v1/laundry",{
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body:JSON.stringify(updatedEntry)
    })
    window.location.reload()
    // const laundryEntries = JSON.parse(localStorage.getItem('laundryEntries')) || [];
    // laundryEntries[index] = updatedEntry;
    // localStorage.setItem('laundryEntries', JSON.stringify(laundryEntries));
}

async function loadLaundryEntries() {
    const res = await fetch("/api/v1/laundry");
    const data =await res.json()
    const laundryEntries = data || [];
    const tableBody = document.querySelector('#laundryTable tbody');
    tableBody.innerHTML = '';

    laundryEntries.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.fullName}</td>
            <td>${entry.roomNumber}</td>
            <td>${entry.numberOfClothes}</td>
            <td>${entry.typeOfService}</td>
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

async function editLaundryEntry(index) {
    const res = await fetch("/api/v1/laundry");
    const data =await res.json()
    const laundryEntries = data || [];
    const entry = laundryEntries[index];
    if(entry.isPrint){
        alert("Can't edit after print")
        return
    }
    document.getElementById('fullName').value = entry.fullName;
    document.getElementById('roomNo').value = entry.roomNumber;
    document.getElementById('totalClothes').value = entry.numberOfClothes;
    document.getElementById('serviceType').value = entry.typeOfService;
    document.getElementById('paymentMethod').value = entry.paymentMethod;
    document.getElementById('totalAmount').value = entry.totalAmount;

    document.getElementById('laundryForm').dataset.editingIndex = index;
    currentUpdateId = entry._id
}

async function printLaundryEntry(index) {
    const res = await fetch("/api/v1/laundry");
    const data =await res.json()
    const laundryEntries = data || [];
    const entry = laundryEntries[index];

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <h1>Montevar Hotel</h1>
        <h2>Laundry Service Receipt</h2>
        <p><strong>Full Name:</strong> ${entry.fullName}</p>
        <p><strong>Room No:</strong> ${entry.roomNumber}</p>
        <p><strong>Total Clothes:</strong> ${entry.numberOfClothes}</p>
        <p><strong>Type of Services Provided:</strong> ${entry.typeOfService}</p>
        <p><strong>Payment Method:</strong> ${entry.paymentMethod}</p>
        <p><strong>Total Amount:</strong> ${entry.totalAmount}</p>
        <p><strong>Date:</strong> ${entry.date}</p>
        <hr>
        <button onclick="window.print()">Print</button>
        <button onclick="window.close()">Close</button>
    `);
    await fetch("/api/v1/laundry",{
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body:JSON.stringify({isPrint:true, _id:entry._id,edit:true})
    })
    printWindow.document.close();
    printWindow.focus();
}

// function exportToLaundryReport(entry) {
//     const laundryReportEntries = JSON.parse(localStorage.getItem('laundryReportEntries')) || [];
//     laundryReportEntries.push(entry);
//     localStorage.setItem('laundryReportEntries', JSON.stringify(laundryReportEntries));
// }
