document.addEventListener("DOMContentLoaded", async () => {
  const logoutButton = document.querySelector(".profile-actions .action-button");
  const usernameDisplay = document.querySelector(".username-display");
  const ordersContainer = document.getElementById("orders-container");

  const token = localStorage.getItem("user");

  if (token == null) {
    alert("Login to view Profile");
    window.location.href = "../../../Assets/pages/html/login.html";
  } else {
    try {
      const userResponse = await fetch("https://pet-world-fastapi-spsz.onrender.com/users/current-user", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const userData = await userResponse.json();
      usernameDisplay.textContent = `Welcome, ${userData.username}`;
      console.log("Logged in user:", userData.user);

      const ordersResponse = await fetch("https://pet-world-fastapi-spsz.onrender.com/order/getOrders", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (ordersResponse.ok) {
        const orders = await ordersResponse.json();
        displayOrders(orders);
      } else {
        const result = await ordersResponse.json();
        ordersContainer.innerHTML = ''; 
        ordersContainer.innerHTML = '<p style="font-size: 16px">No orders found.</p>';
        
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Try again later.");
    }
  }

  
  function displayOrders(orders) {
    ordersContainer.innerHTML = ''; 

    

    orders.forEach(order => {
      const orderElement = document.createElement("div");
      orderElement.classList.add("order-item");



      orderElement.innerHTML = `
    <div class="order-items">
      <p>Date: ${new Date(order.created_at).toLocaleDateString()}</p>
      <p>Total: ₹${order.product_price * order.quantity}</p> 
      <div class="order-item-details">
        <img src="${order.product_image }" alt="${order.product_name}" style="width: 50px; height: 50px; object-fit: cover;">
        <p><strong>${order.product_name}</strong></p>
        <p>Quantity: ${order.quantity}</p>
        <p>Price: ₹${order.product_price}</p>
      </div>
    </div>
`;
      

      ordersContainer.appendChild(orderElement);
    });
  }

 
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      console.log("Logout button clicked");
      try {
        localStorage.removeItem('user');
        console.log("Signed out successfully");
        window.location.href = "../../../Assets/pages/html/login.html";
      } catch (error) {
        console.error("Error signing out:", error);
      }
    });
  } else {
    console.error("Logout button not found in the DOM.");
  }

  document.getElementById("go-back-btn").addEventListener("click", () => {
    localStorage.removeItem("buyNowProduct")
    window.history.back();
  });
});
