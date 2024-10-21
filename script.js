function searchinPage() {
    // Get the search input value
    var input = document.getElementById("text-input").value.toLowerCase();
    
    // Get all the text content of the page
    var content = document.body.innerText.toLowerCase();
    
    // Check if the input exists in the content
    if(content.includes(input)) {
        alert("Found: " + input);
    } else {
        alert("Not found: " + input);
    }
}

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
        const itemDescription = this.dataset.itemDescription;

        // Store item details in session storage
        sessionStorage.setItem('itemName', itemName);
        sessionStorage.setItem('itemPrice', itemPrice);
        sessionStorage.setItem('itemImage', itemImage);
        sessionStorage.setItem('itemDescription',itemDescription);

        // Redirect to payment page
        window.location.href = `payment.html`;
    });
});

// Function to fetch item details from session storage
function fetchItemDetails() {
    const itemName = sessionStorage.getItem('itemName');
    const itemPrice = sessionStorage.getItem('itemPrice');
    const itemImage = sessionStorage.getItem('itemImage');
    const itemDescription = sessionStorage.getItem('itemDescription');


    // Check if item details are present in session storage
    if (itemName && itemPrice && itemImage) {
        // Display the item details on the payment page along with quantity input and total price

        document.getElementById("name").innerText = `${itemName}`;
        document.getElementById("price").innerText = `${itemPrice}`;
        document.getElementById("description").innerText = `${itemDescription}`;
        document.getElementById("img-pic").innerHTML = `<img src="https://${itemImage}">`;
    



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


    if (quantity === 0 || quantity > 10) {
        alert("Please Enter A Value Between 1 to 10");
        document.getElementById("quantity").value=" ";
    } else {
        document.getElementById('total-price').textContent = `₹ ${totalPrice}`;
        sessionStorage.setItem('totalPrice', totalPrice);
    }
    
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

const upiRadioButton = document.getElementById('payment_method_1');
const codRadioButton = document.getElementById('payment_method_0');
const upiPaymentLink = document.getElementById('upiPaymentLink');
const totalPrice = sessionStorage.getItem('totalPrice');

  // Add event listeners for changes in the radio buttons
  upiRadioButton.addEventListener('change', function() {
    if (upiRadioButton.checked) {
      upiPaymentLink.style.display = 'block';
      upiPaymentLink.innerHTML = `<a href="https://getupilink.com/upi/lucky81205@okicici?am=${totalPrice}"><h4>Click Me To Pay</h4></a>`;
    }
  });

  codRadioButton.addEventListener('change', function() {
    if (codRadioButton.checked) {
      upiPaymentLink.innerHTML = '';
      upiPaymentLink.style.display = 'none';
    }
  });


const form = document.getElementById('orderForm');

form.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the form from submitting the traditional way

  // Collect the form data
  const orderData = {
      item: sessionStorage.getItem('itemName'),
      quantity: document.getElementById('quantity').value,
      price: sessionStorage.getItem('totalPrice'),
      customerName: document.getElementById('customer_name').value,
      customerEmail: document.getElementById('email_address').value,
      customerMobile: document.getElementById('mobile_number').value
  };
  console.log(orderData);

  // Send the data to the backend
  try {
      const response = await fetch('https://khushi-crafts.onrender.com/submit-order', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
      });

      // Check if the response status is OK (200-299)
      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      // Detect the Content-Type of the response
      const contentType = response.headers.get('Content-Type');

      let result;
      if (contentType && contentType.includes('application/json')) {
          // If the response is JSON
          result = await response.json();
      } else {
          // If the response is text or any other type
          result = await response.text();
      }

      // Display the success message or response
      document.getElementById('response').innerText = (typeof result === 'string') ? result : result.message;
      
  } catch (error) {
      console.error('Error submitting order:', error);
      document.getElementById('response').innerText = 'Error submitting order: ' + error.message;
  }
});
