document.addEventListener("DOMContentLoaded", function () {

    // ===============================
    // Handle Donate Form
    // ===============================
    const donateForm = document.getElementById("donateForm");

    if (donateForm) {
        donateForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const foodName = document.getElementById("foodName").value;
            const quantity = document.getElementById("quantity").value;
            const location = document.getElementById("location").value;
            const expiryTime = document.getElementById("expiryTime").value;
            if (foodName.trim() === "" || location.trim() === "") {
                alert("Food name and location cannot be empty");
                return;
            }
            
            if (quantity <= 0) {
                alert("Quantity must be greater than 0");
                return;
            }
            

            const foodData = {
                foodName,
                quantity,
                location,
                expiryTime,
            };

            let foodList = JSON.parse(localStorage.getItem("foodList")) || [];
            foodList.push(foodData);
            localStorage.setItem("foodList", JSON.stringify(foodList));

            const msg = document.getElementById("successMsg");
            if (msg) {
                msg.style.display = "block";
                setTimeout(() => {
                    msg.style.display = "none";
                }, 3000);
            }
            
            donateForm.reset();
        });
    }

    // ===============================
    // Display Food in Available Page
    // ===============================
    const foodTable = document.getElementById("foodTable");

    if (foodTable) {
        let foodList = JSON.parse(localStorage.getItem("foodList")) || [];
        // Remove expired food items
const now = new Date();
const currentMinutes = now.getHours() * 60 + now.getMinutes();

foodList = foodList.filter(food => {
    if (!food.expiryTime) return true;

    const [h, m] = food.expiryTime.split(":").map(Number);
    const expiryMinutes = h * 60 + m;

    return expiryMinutes > currentMinutes;
});
const countEl = document.getElementById("itemCount");
if (countEl) {
    countEl.textContent = `Available Food (${foodList.length} items)`;
}

// Save updated list back to localStorage
localStorage.setItem("foodList", JSON.stringify(foodList));


        foodList.forEach((food, index) => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${food.foodName}</td>
                <td>${food.quantity}</td>
                <td>${food.location}</td>
                <td>${food.expiryTime}</td>
                <td><button onclick="deleteFood(${index})">Delete</button></td>
                <td><button onclick="editFood(${index})">Edit</button></td>
            `;

            foodTable.appendChild(row);
        });
    }

});
function deleteFood(index) {
    let foodList = JSON.parse(localStorage.getItem("foodList")) || [];
    foodList.splice(index, 1);
    localStorage.setItem("foodList", JSON.stringify(foodList));
    location.reload();
}
function clearAllFood() {

    if (confirm("Are you sure you want to clear all donations?")) {
        localStorage.removeItem("foodList");
        location.reload();
    }
}
function editFood(index) {
    let foodList = JSON.parse(localStorage.getItem("foodList")) || [];
    const item = foodList[index];

    const newName = prompt("Edit Food Name:", item.foodName);
    const newQty = prompt("Edit Quantity:", item.quantity);
    const newLoc = prompt("Edit Location:", item.location);
    const newTime = prompt("Edit Expiry Time (HH:MM):", item.expiryTime);

    if (newName && newQty && newLoc && newTime) {
        foodList[index] = {
            foodName: newName,
            quantity: newQty,
            location: newLoc,
            expiryTime: newTime
        };
        localStorage.setItem("foodList", JSON.stringify(foodList));
        location.reload();
    }
}

