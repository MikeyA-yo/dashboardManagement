let currentEditIndex;
document.addEventListener("DOMContentLoaded", function () {
    let editMode = false;

    const roomFoodForm = document.getElementById("food-form");
    const foodItemsContainer = document.getElementById("food-items-container");
    const entriesTableBody = document.getElementById("entries-table-body");

    // Load saved food entries
    loadFoodEntries();

    // Event listener for adding and removing food items
    foodItemsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-food")) {
            addFoodItem();
        } else if (e.target.classList.contains("remove-food")) {
            e.target.closest(".food-item").remove();
            calculateTotalAmount();
        }
    });

    // Calculate total amount dynamically
    foodItemsContainer.addEventListener("input", calculateTotalAmount);

    // Form submission
    roomFoodForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const entry = collectFormData();
        if (editMode) {
            updateEntry(entry);
        } else {
            addNewEntry(entry);
        }
         // this isn't being used here
        // saveEntries();
        resetForm();
    });

    // Edit, Export, and Print functionality
    entriesTableBody.addEventListener("click", (e) => {
        if (e.target.classList.contains("edit-entry")) {
            prepareEditEntry(e.target.closest("tr"));
        } else if (e.target.classList.contains("print-receipt")) {
            printReceipt(e.target.closest("tr"));

        }
    });

    // Functions

    function addFoodItem(type = "", amount = "") {
        const newFoodItem = document.createElement("div");
        newFoodItem.classList.add("food-item");
        newFoodItem.innerHTML = `
            <div class="food-item-flex">
                 <div class="cnt">
                <label>Food/Beverage:</label>
                <input type="text" class="food-type" name="foodType[]" value="${type}" required></div>
                <div class="cnt nt">
                <label><br>Amount:</label>
                <input type="number" class="food-amount" name="foodAmount[]" value="${amount}" min="0" required></div>
            </div>
            <button type="button" class="remove-food">-</button>
        `;
        foodItemsContainer.appendChild(newFoodItem);
    }

    function calculateTotalAmount() {
        const foodAmounts = document.querySelectorAll(".food-amount");
        const total = Array.from(foodAmounts).reduce(
            (sum, input) => sum + Number(input.value || 0),
            0
        );
        document.getElementById("total-amount").value = total;
    }

    function collectFormData() {
        const roomNo = document.getElementById("room-no").value;
        const paymentMethod = document.getElementById("payment-method").value;
        const serviceLocation = document.getElementById("service-location").value;
        const foodTypes = Array.from(document.querySelectorAll(".food-type")).map((input) => input.value);
        const foodAmounts = Array.from(document.querySelectorAll(".food-amount")).map((input) => input.value);
        const totalAmount = document.getElementById("total-amount").value;
        const dateOfEntry = new Date().toLocaleString();

        return { roomNo, foodTypes, foodAmounts, paymentMethod, serviceLocation, totalAmount, dateOfEntry };
    }

    async function addNewEntry(entry) {
        addEntryToTable(entry);
        await fetch ("/api/v1/food", {
            method:"POST",
            body:JSON.stringify(entry),
            headers:{
                "Content-type":"application/json"
            }
        })
        // const entries = getEntries();
        // entries.push(entry);
        // saveEntries(entries);
    }

    function addEntryToTable(entry) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.roomNo}</td>
            <td>
                ${entry.foodTypes.map((type, index) => `<div>${type} - ${entry.foodAmounts[index]}</div>`).join("")}
            </td>
            <td>${entry.paymentMethod}</td>
            <td>${entry.serviceLocation}</td>
            <td>${entry.totalAmount}</td>
            <td>${entry.dateOfEntry}</td>
            <td>
                <button class="edit-entry">Edit</button>
                <button class="print-receipt">Print</button>
            </td>
        `;
        entriesTableBody.appendChild(row);
    }

    async function prepareEditEntry(row) {
        const cells = row.children;
        const roomNo = cells[0].textContent;
        const paymentMethod = cells[2].textContent;
        const serviceLocation = cells[3].textContent;
        const totalAmount = cells[4].textContent;
        //get entry for isPrint check
        let index = Array.from(entriesTableBody.children).indexOf(row);
        const entries = await getEntries();
        const entry = entries[index];
        if(entry.isPrint){
            alert("Can't edit after making a print out")
            return
        }
        const foodDetails = Array.from(cells[1].querySelectorAll("div")).map((div) => {
            const [type, amount] = div.textContent.split(" - ");
            return { type, amount };
        });

        document.getElementById("room-no").value = roomNo;
        document.getElementById("payment-method").value = paymentMethod;
        document.getElementById("service-location").value = serviceLocation;
        document.getElementById("total-amount").value = totalAmount;

        foodItemsContainer.innerHTML = "";
        foodDetails.forEach(({ type, amount }) => addFoodItem(type, amount));

        editMode = true;
        currentEditIndex = Array.from(entriesTableBody.children).indexOf(row);
    }

    async function updateEntry(entry) {
        const entries = await getEntries();
        entry._id = entries[currentEditIndex]._id 
        saveEntries(entry);
        reloadTable();
        editMode = false;
    }

    async function printReceipt(row) {
        const entry = collectRowData(row);

         //get id for isPrint edit
         let index = Array.from(entriesTableBody.children).indexOf(row);
         const entries = await getEntries();
         const _id = entries[index]._id
         
        const receiptContent = `
            <h1>Montevar Hotel</h1>
            <h3>Food/Beverage Receipt</h3>
            <p><strong>Room No:</strong> ${entry.roomNo}</p>
            <p><strong>Food/Beverage:</strong> <br> ${entry.foodTypes.map(
                (type, index) => `${type} - ${entry.foodAmounts[index]}`
            ).join("<br>")}</p>
            <p><strong>Payment Method:</strong> ${entry.paymentMethod}</p>
            <p><strong>Service Location:</strong> ${entry.serviceLocation}</p>
            <p><strong>Total Amount:</strong> ${entry.totalAmount}</p>
            <p><strong>Date of Entry:</strong> ${entry.dateOfEntry}</p>
        `;

        const printWindow = window.open("", "_blank");
        printWindow.document.write(receiptContent);
        printWindow.document.close();
        printWindow.print();

        await fetch("/api/v1/food", {
            method:"POST",
            body: JSON.stringify({edit:true, isPrint:true, _id}),
            headers:{
                "Content-type":"application/json"
            }
        })
    }

    function resetForm() {
        roomFoodForm.reset();
        foodItemsContainer.innerHTML = "";
        editMode = false;
        // in this place setting currentEditIndex to null causes a null error
    }

    async function reloadTable() {
        entriesTableBody.innerHTML = "";
        const entries = await getEntries();
        entries.forEach(addEntryToTable);
    }
     //instead take _id as param
    async function saveEntries(entry) {
        entry.edit = true
        await fetch ("/api/v1/food", {
            method:"POST",
            body:JSON.stringify(entry),
            headers:{
                "Content-type":"application/json"
            }
        })
    }
    //todo no more local storage
    async function getEntries() {
        const res = await fetch("/api/v1/food")
        return (await res.json()).foods || [];
    }
     //todo
    async function loadFoodEntries() {
        const entries = await getEntries();
        entries.forEach(addEntryToTable);
    }

    function collectRowData(row) {
        const cells = row.children;
        return {
            roomNo: cells[0].textContent,
            foodTypes: Array.from(cells[1].querySelectorAll("div")).map(div => div.textContent.split(" - ")[0]),
            foodAmounts: Array.from(cells[1].querySelectorAll("div")).map(div => div.textContent.split(" - ")[1]),
            paymentMethod: cells[2].textContent,
            serviceLocation: cells[3].textContent,
            totalAmount: cells[4].textContent,
            dateOfEntry: cells[5].textContent,
        };
    }
});
