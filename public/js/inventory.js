const salesUrl ="/api/v1/inventory/"
document.addEventListener('DOMContentLoaded', function() {
    // Handle Sales Section Submission
    document.getElementById('salesForm').addEventListener('submit',async function(event) {
        event.preventDefault();
        
        const bookingsSales = parseFloat(document.getElementById('bookingsSales').value) || 0;
        const foodSales = parseFloat(document.getElementById('foodSales').value) || 0;
        const drinksSales = parseFloat(document.getElementById('drinksSales').value) || 0;
        const eventsSales = parseFloat(document.getElementById('eventsSales').value) || 0;
        const laundrySales = parseFloat(document.getElementById('laundrySales').value) || 0;
        const poolSales = parseFloat(document.getElementById('poolSales').value) || 0;

        const totalSales = bookingsSales + foodSales + drinksSales + eventsSales + laundrySales + poolSales;
        const dateTime = new Date().toLocaleString();

        const salesEntry = {
            bookingsEndOfDaySales: bookingsSales, foodEndOfDaySales:foodSales, drinksEndOfDaySales:drinksSales, eventsEndOfDaySales:eventsSales,laundryEndOfDaySales: laundrySales, poolEndOfDaySales:poolSales, totalSales, date:dateTime
        };
        await fetch(`${salesUrl}totalSales`,{
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body: JSON.stringify(salesEntry)
        } )
        // let salesEntries = JSON.parse(localStorage.getItem('salesEntries')) || [];
        // salesEntries.push(salesEntry);
        // localStorage.setItem('salesEntries', JSON.stringify(salesEntries));

        loadSalesEntries();
        document.getElementById('salesForm').reset();
    });

    // Load Sales Entries
    async function loadSalesEntries() {
        const res = await fetch(`${salesUrl}totalSales`)
        const data = await res.json()
        const salesEntries = data.totalSales || [];
        const tableBody = document.getElementById('salesEntriesTable');
        tableBody.innerHTML = '';

        salesEntries.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.date}</td>
                <td>${entry.bookingsEndOfDaySales}</td>
                <td>${entry.foodEndOfDaySales}</td>
                <td>${entry.drinksEndOfDaySales}</td>
                <td>${entry.eventsEndOfDaySales}</td>
                <td>${entry.laundryEndOfDaySales}</td>
                <td>${entry.poolEndOfDaySales}</td>
                <td>${entry.totalSales}</td>
            `;
            tableBody.appendChild(row);
        });
    }
   
    // Clear Sales Entries
    document.getElementById('clearSales').addEventListener('click', async function() {
        await fetch(`${salesUrl}totalSales`, {
            method:"DELETE"
        })
        // localStorage.removeItem('salesEntries');
        loadSalesEntries();
    });

    // Handle Storage Section Submission
    document.getElementById('storageForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const productName = document.getElementById('productNameStorage').value;
        const quantity = parseInt(document.getElementById('quantityStorage').value) || 0;
        const dateTime = new Date().toLocaleString();

        const storageEntry = { productName, quantity, date:dateTime };
         await fetch(`${salesUrl}dailyStorageEntry`,{
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body: JSON.stringify(storageEntry)
         })
        // let storageEntries = JSON.parse(localStorage.getItem('storageEntries')) || [];
        // storageEntries.push(storageEntry);
        // localStorage.setItem('storageEntries', JSON.stringify(storageEntries));

        loadStorageEntries();
        document.getElementById('storageForm').reset();
    });

    // Load Storage Entries
    async function loadStorageEntries() {
        const res = await fetch(`${salesUrl}dailyStorageEntry`)
        const data = await res.json()
        const storageEntries = data.entries || [];
        const tableBody = document.getElementById('storageEntriesTable');
        tableBody.innerHTML = '';

        storageEntries.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.date}</td>
                <td>${entry.productName}</td>
                <td>${entry.quantity}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Clear Storage Entries
    document.getElementById('clearStorage').addEventListener('click', async function() {
        await fetch(`${salesUrl}dailyStorageEntry`, {
            method:"DELETE"
        })
        loadStorageEntries();
    });

    // Handle Usage Section Submission
    document.getElementById('usageForm').addEventListener('submit',async function(event) {
        event.preventDefault();

        const productName = document.getElementById('productNameUsage').value;
        const quantity = parseInt(document.getElementById('quantityUsage').value) || 0;
        const dateTime = new Date().toLocaleString();

        const usageEntry = { productName, takeOutQuantity: quantity, date:dateTime };
        
        await fetch(`${salesUrl}storageUsageEntry`,{
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body: JSON.stringify(usageEntry)
         })
        // let usageEntries = JSON.parse(localStorage.getItem('usageEntries')) || [];
        // usageEntries.push(usageEntry);
        // localStorage.setItem('usageEntries', JSON.stringify(usageEntries));

        loadUsageEntries();
        document.getElementById('usageForm').reset();
    });

    // Load Usage Entries
    async function loadUsageEntries() {
        const res = await fetch(`${salesUrl}storageUsageEntry`)
        const data = await res.json()
        const usageEntries = data.entries || [];
        const tableBody = document.getElementById('usageEntriesTable');
        tableBody.innerHTML = '';

        usageEntries.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.date}</td>
                <td>${entry.productName}</td>
                <td>${entry.takeOutQuantity}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Clear Usage Entries
    document.getElementById('clearUsage').addEventListener('click',async function() {
        await fetch(`${salesUrl}storageUsageEntry`, {
            method:"DELETE"
        })
        // localStorage.removeItem('usageEntries');
        loadUsageEntries();
    });

    // Initial Load
    loadSalesEntries();
    loadStorageEntries();
    loadUsageEntries();
});
