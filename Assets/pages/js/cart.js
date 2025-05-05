let token = localStorage.getItem("user");

if (token == null) {
  alert("Please log in first.");
} else {
  document.addEventListener("DOMContentLoaded", () => {
    loadCartItems(); 
  });
}

function loadCartItems() {
  fetch("http://127.0.0.1:8000/cart/", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {
      const cartContainer = document.getElementById("cart-list");
      const totalPrice = document.getElementById("total-price");

      cartContainer.innerHTML = "";

      if (data.message) {
        cartContainer.innerHTML = `<p>${data.message}</p>`;
        return;
      }

      data.cart_items.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";
        itemDiv.innerHTML = `
          <img src="${item.product_image}" alt="${item.product_name}" />
          <p><strong>${item.product_name}</strong></p>
          <p>Price: ₹${item.price}</p>
          <div class="quantity-controls">
            <button onclick="decreaseQuantity('${item.product_id}', ${item.quantity})">-</button>
            <span>${item.quantity}</span>
            <button onclick="increaseQuantity('${item.product_id}', ${item.quantity})">+</button>
          </div>
          <button onclick="remove('${item.product_id}')">Remove</button>
        `;
        cartContainer.appendChild(itemDiv);
      });
      totalPrice.textContent = data.total_price.toFixed(2);
    })
    .catch(error => {
      console.error("Error loading cart:", error);
    });
}

window.remove = function (product_id) {
  let token = localStorage.getItem("user");

  fetch(`http://127.0.0.1:8000/cart/deleteItem/${product_id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);
    loadCartItems();
  })
  .catch(error => {
    console.error("Error removing item:", error);
  });
}

window.increaseQuantity = function (product_id, currentQty) {
  if(currentQty < 20){
  updateQuantity(product_id,  1);
  }
}

window.decreaseQuantity = function (product_id, currentQty) {
  if (currentQty > 1) {
    updateQuantity(product_id, -1);
  }
}

function updateQuantity(product_id, change) {
  let token = localStorage.getItem("user");

  fetch(`http://127.0.0.1:8000/cart/update_quantity/${product_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      product_id: product_id,
      change: change
    })
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);
    loadCartItems(); 
  })
  .catch(error => {
    console.error("Error updating quantity:", error);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const placeOrderBtn = document.getElementById("place-order-button");

  placeOrderBtn.addEventListener("click", () => {
    let token = localStorage.getItem("user");

    if (!token) {
      alert("Please login first!");
      return;
    }

    fetch("http://127.0.0.1:8000/cart/", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.cart_items && data.cart_items.length > 0) {
        localStorage.setItem("buyNowProduct", JSON.stringify(data.cart_items));
        window.location.href = "../../../Assets/pages/html/billingdetails.html";
      } else {
        alert("Your cart is empty!");
      }
    })
    .catch(error => {
      console.error("Error fetching cart items:", error);
    });
  });

  document.getElementById("go-back-btn").addEventListener("click", () => {
    localStorage.removeItem("buyNowProduct")
    window.history.back();
  });
});
