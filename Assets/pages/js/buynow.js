window.addEventListener("DOMContentLoaded", () => {
  const products = JSON.parse(localStorage.getItem("buyNowProduct"));
  console.log(products);

  if (!products) {
    document.getElementById("product-section").innerHTML = "<p>No product selected.</p>";
    return;
  }

  products.forEach((product) => {
  const productsList = document.getElementById("products-list");
  productsList.innerHTML = `
    <div class="product-item">
      <img src="${product.image}" alt="${product.name}" style="width: 100px; height: 100px;">
      <p><strong>${product.name}</strong></p>
      <p>Price: ₹<span id="total-price">${product.price}</span></p>
      <label for="quantity">Quantity:</label>
      <select id="quantity">
        ${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
      </select>
    </div>
  `;

  document.getElementById("quantity").addEventListener("change", () => {
    updateTotalPrice(product.price);
  });
});

  function updateTotalPrice(price) {
    const quantity = document.getElementById("quantity").value;
    const totalPrice = price * quantity;
    document.getElementById("total-price").textContent = totalPrice;
  }

  const confirmOrderBtn = document.getElementById("confirm-order-btn");

  if (confirmOrderBtn) {
    confirmOrderBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const firstName = document.getElementById("first-name").value;
      const lastName = document.getElementById("last-name").value;
      const quantity = parseInt(document.getElementById("quantity").value);
      const address = document.getElementById("address").value;
      const city = document.getElementById("city").value;
      const state = document.getElementById("state").value;
      const country = document.getElementById("country").value;
      const pincode = document.getElementById("pincode").value;
      const phone = document.getElementById("phone").value;
      const paymentMethod = document.getElementById("payment-method").value;

      let orderDetails = products.map((product) => {
      return  {
        product_id: product.id,
        product_image: product.image,
        product_name: product.name,
        product_price: product.price,
        quantity: quantity,
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
        orderDetails.paymentInfo = {
          cardNumber: document.getElementById("card-number").value,
          expiryDate: document.getElementById("expiry-date").value,
          cvv: document.getElementById("cvv").value
        };
      }

      try {
        const token = localStorage.getItem("user");

        if (!token) {
          alert("Please log in to place an order.");
          return;
        }

        const response = await fetch("https://pet-world-fastapi-spsz.onrender.com/order/placeOrder", {
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
