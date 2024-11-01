document.addEventListener('DOMContentLoaded', function() {
    // Handle Sales Section Submission
    document.getElementById('salesForm').addEventListener('submit', function(event) {
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
            bookingsSales, foodSales, drinksSales, eventsSales, laundrySales, poolSales, totalSales, dateTime
        };

        let salesEntries = JSON.parse(localStorage.getItem('salesEntries')) || [];
        salesEntries.push(salesEntry);
        localStorage.setItem('salesEntries', JSON.stringify(salesEntries));

        loadSalesEntries();
        document.getElementById('salesForm').reset();
    });

    // Load Sales Entries
    function loadSalesEntries() {
        const salesEntries = JSON.parse(localStorage.getItem('salesEntries')) || [];
        const tableBody = document.getElementById('salesEntriesTable');
        tableBody.innerHTML = '';

        salesEntries.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.dateTime}</td>
                <td>${entry.bookingsSales}</td>
                <td>${entry.foodSales}</td>
                <td>${entry.drinksSales}</td>
                <td>${entry.eventsSales}</td>
                <td>${entry.laundrySales}</td>
                <td>${entry.poolSales}</td>
                <td>${entry.totalSales}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Clear Sales Entries
    document.getElementById('clearSales').addEventListener('click', function() {
        localStorage.removeItem('salesEntries');
        loadSalesEntries();
    });

    // Handle Storage Section Submission
    document.getElementById('storageForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const productName = document.getElementById('productNameStorage').value;
        const quantity = parseInt(document.getElementById('quantityStorage').value) || 0;
        const dateTime = new Date().toLocaleString();

        const storageEntry = { productName, quantity, dateTime };

        let storageEntries = JSON.parse(localStorage.getItem('storageEntries')) || [];
        storageEntries.push(storageEntry);
        localStorage.setItem('storageEntries', JSON.stringify(storageEntries));

        loadStorageEntries();
        document.getElementById('storageForm').reset();
    });

    // Load Storage Entries
    function loadStorageEntries() {
        const storageEntries = JSON.parse(localStorage.getItem('storageEntries')) || [];
        const tableBody = document.getElementById('storageEntriesTable');
        tableBody.innerHTML = '';

        storageEntries.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.dateTime}</td>
                <td>${entry.productName}</td>
                <td>${entry.quantity}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Clear Storage Entries
    document.getElementById('clearStorage').addEventListener('click', function() {
        localStorage.removeItem('storageEntries');
        loadStorageEntries();
    });

    // Handle Usage Section Submission
    document.getElementById('usageForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const productName = document.getElementById('productNameUsage').value;
        const quantity = parseInt(document.getElementById('quantityUsage').value) || 0;
        const dateTime = new Date().toLocaleString();

        const usageEntry = { productName, quantity, dateTime };

        let usageEntries = JSON.parse(localStorage.getItem('usageEntries')) || [];
        usageEntries.push(usageEntry);
        localStorage.setItem('usageEntries', JSON.stringify(usageEntries));

        loadUsageEntries();
        document.getElementById('usageForm').reset();
    });

    // Load Usage Entries
    function loadUsageEntries() {
        const usageEntries = JSON.parse(localStorage.getItem('usageEntries')) || [];
        const tableBody = document.getElementById('usageEntriesTable');
        tableBody.innerHTML = '';

        usageEntries.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.dateTime}</td>
                <td>${entry.productName}</td>
                <td>${entry.quantity}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Clear Usage Entries
    document.getElementById('clearUsage').addEventListener('click', function() {
        localStorage.removeItem('usageEntries');
        loadUsageEntries();
    });

    // Initial Load
    loadSalesEntries();
    loadStorageEntries();
    loadUsageEntries();
});
