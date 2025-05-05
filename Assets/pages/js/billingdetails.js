document.addEventListener("DOMContentLoaded", () => {
  const products = JSON.parse(localStorage.getItem("buyNowProduct"));
  const productListContainer = document.getElementById("products-list");

  if (!products || products.length === 0) {
    document.getElementById("product-section").innerHTML = "<p>No products selected.</p>";
    return;
  }

  products.forEach((product) => {
    const productItem = document.createElement("div");
    productItem.classList.add("product-item");
    productItem.innerHTML = `
      <img src="${product.product_image}" alt="${product.product_name}" style="width: 100px; height: 100px;">
      <p><strong>${product.product_name}</strong></p>
      <p>Price: ₹<span class="product-price" data-price="${product.price}">${product.price}</span></p>
      <p>Quantity: ${product.quantity}</p>
    `;
    productListContainer.appendChild(productItem);
  });

  
  const confirmOrderBtn = document.getElementById("confirm-order-btn");

  if (confirmOrderBtn) {
    confirmOrderBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const firstName = document.getElementById("first-name").value;
      const lastName = document.getElementById("last-name").value;
      const address = document.getElementById("address").value;
      const city = document.getElementById("city").value;
      const state = document.getElementById("state").value;
      const country = document.getElementById("country").value;
      const pincode = document.getElementById("pincode").value;
      const phone = document.getElementById("phone").value;
      const paymentMethod = document.getElementById("payment-method").value;

      let orderDetails = products.map((product) => {
        return {
          product_id: product.product_id,
          product_image: product.product_image,
          product_name: product.product_name,
          product_price: product.price,
          quantity: parseInt(product.quantity),
          name: firstName,
          email: email,
          address: address,
          city: city,
          state: state,
          country: country,
          pincode: pincode,
          phoneNo: phone,
          payment_method: paymentMethod
        };
      });

      console.log(orderDetails);
      if (paymentMethod === 'credit-card' || paymentMethod === 'debit-card') {
        orderDetails.forEach((order) => {
          order.paymentInfo = {
            cardNumber: document.getElementById("card-number").value,
            expiryDate: document.getElementById("expiry-date").value,
            cvv: document.getElementById("cvv").value
          };
        });
      }

      try {
        
        const token = localStorage.getItem("user");

        if (!token) {
          alert("Please log in to place an order.");
          return;
        }

        const response = await fetch("http://localhost:8000/order/placeOrder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(orderDetails)
        });

        const result = await response.json();

        if (response.ok) {
          alert("Order placed successfully!");
          localStorage.removeItem("buyNowProduct"); 
          window.location.href = "../../../index.html"; 
        } else {
          alert(result.detail || "Failed to place order.");
        }
      } catch (error) {
        console.error("Order Error:", error);
        alert("Something went wrong. Try again later.");
      }
    });
  } else {
    console.error("Confirm Order button not found.");
  }

  document.getElementById("go-back-btn").addEventListener("click", () => {
    localStorage.removeItem("buyNowProduct")
    window.history.back();
  });
});
