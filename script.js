function hideLoader() {
    const loaderContainer = document.getElementById('loader-container');
    loaderContainer.style.display = 'none';
}

// Add event listener for the window load event
window.addEventListener('load', hideLoader);



// Select all the 'Buy Now' buttons
document.querySelectorAll('.buy-now').forEach(button => {
    button.addEventListener('click', function() {
        // Get item details from data attributes
        const itemName = this.dataset.itemName;
        const itemPrice = this.dataset.itemPrice;
        const itemImage = this.dataset.itemImage;

        // Store item details in session storage
        sessionStorage.setItem('itemName', itemName);
        sessionStorage.setItem('itemPrice', itemPrice);
        sessionStorage.setItem('itemImage', itemImage);

        // Redirect to payment page
        window.location.href = `payment.html`;
    });
});

// Function to fetch item details from session storage
function fetchItemDetails() {
    const itemName = sessionStorage.getItem('itemName');
    const itemPrice = sessionStorage.getItem('itemPrice');
    const itemImage = sessionStorage.getItem('itemImage');

    // Check if item details are present in session storage
    if (itemName && itemPrice && itemImage) {
        // Display the item details on the payment page along with quantity input and total price

        document.getElementById("name").innerText = `${itemName}`;
        document.getElementById("price").innerText = `${itemPrice}`;
        //document.getElementById("description").innerText = `${itemName}`;
    



        // Initialize the total price based on the initial quantity (1)
        updateTotalPrice(); 
    } else {
        // If no details are found, display an error message
        document.getElementById('item-details').innerHTML = `
            <p>Error: Item details not found.</p>
        `;
    }
}

// Function to update the total price based on the quantity input
function updateTotalPrice() {
    const itemPrice = sessionStorage.getItem('itemPrice'); // Get price from session storage
    const quantity = document.getElementById('quantity').value; // Get current quantity
    const totalPrice = itemPrice * quantity; // Calculate total price

    // Update the total price display
    document.getElementById('total-price').textContent = `Total Price: ₹${totalPrice}`;
}

// Function to determine if the current page is payment.html
function isPaymentPage() {
    return window.location.pathname.includes('payment.html');
}

// Run the function only if the current page is payment.html
window.onload = function() {
    if (isPaymentPage()) {
        fetchItemDetails();
    }
};
