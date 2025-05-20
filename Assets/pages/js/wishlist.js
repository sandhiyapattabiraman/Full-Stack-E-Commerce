document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("user");
  
  if (!token) {
    alert("Please log in to view your wishlist.");
    return;
  }

  fetch("https://pet-world-fastapi-spsz.onrender.com/wishlist/", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    const wishlistContainer = document.getElementById("wishlist-container");
    
    if (data.wishlist && data.wishlist.length > 0) {
      data.wishlist.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("wishlist-item");
        
        
        div.innerHTML = `
          <img src="${item.image}" alt="${item.name}"  width="50" height="50">
          <p>${item.name}</p>
          <p>₹${item.price}</p>
          <button type="button" class="Button" onclick="addToCart('${item.product_id}')">Add to Cart</button>
          <button type="button" class="Button" onclick="buyNow('${item.product_id}','${item.name}', '${item.image}', '${item.price}')">Buy Now</button>
          <button class="Button" onclick="removeFromWishlist('${item.product_id}')">Remove</button>
        `;
        
        wishlistContainer.appendChild(div);
      });
    } else {
      wishlistContainer.innerHTML = "<p>No items in your wishlist.</p>";
    }
  })
  .catch(error => {
    console.error("Error fetching wishlist:", error);
  });
});


window.addToCart = function(productId) {
  const token = localStorage.getItem("user");

  if (!token) {
    alert("Please log in first!");
    return;
  }

  const cartItem = {
    product_id: productId,
    quantity: 1
  };

  fetch('https://pet-world-fastapi-spsz.onrender.com/cart/addToCart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(cartItem)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert(data.message);
    } else {
      alert("Failed to add product to cart.");
    }
  })
  .catch(error => {
    console.error("Error adding product to cart:", error);
    alert("An error occurred.");
  });
}


window.removeFromWishlist = function(productId) {
  const token = localStorage.getItem('user');

  if (!token) {
    alert("Please log in first!");
    return;
  }

  fetch(`https://pet-world-fastapi-spsz.onrender.com/wishlist/removeItem/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert(data.message);
      location.reload();
    } else {
      alert("Failed to remove item from wishlist.");
    }
  })
  .catch(error => {
    console.error("Error removing product from wishlist:", error);
  });
}


window.buyNow = function(productId, name, image, price) {
  let token = localStorage.getItem("user")
  if(!token){
    alert("Please Login first");
    return;
  }
  const product = [{
      id: productId,
      name: name,
      image: image,
      price: price
  }];

  localStorage.setItem("buyNowProduct", JSON.stringify(product));
  window.location.href = "../../../Assets/pages/html/buynow.html";
}


document.getElementById("go-back-btn").addEventListener("click", () => {
  localStorage.removeItem("buyNowProduct")
  window.history.back();
});