let wishlistedProductIds = [];

document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("searchBar");
  const itemsContainer = document.getElementById("items");
  const token = localStorage.getItem("user")

  fetch("https://pet-world-fastapi-spsz.onrender.com/wishlist/", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    wishlistedProductIds = data.wishlist.map(item => item.product_id);
  })
  .catch(error => {
    console.error("Error fetching wishlist:", error);
  });

  searchBar.addEventListener("input", async () => {
    const query = searchBar.value.trim(); 

    if (!query) {
      itemsContainer.innerHTML = ""; 
      return;
    }

    try {
      const url = new URL('https://pet-world-fastapi-spsz.onrender.com/products/search');
      url.searchParams.append('query', query); 

      const response = await fetch(url);
      const products = await response.json();

      if (products.length > 0) {
        itemsContainer.innerHTML = "";

        products.forEach(product => {
          const productElement = document.createElement("div");
          productElement.classList.add("product");
          const isWishlisted = wishlistedProductIds.includes(product.id);
          const heartIcon = isWishlisted ? "❤️" : "♡";

          productElement.innerHTML = `
            <span class="wishlist-heart" onclick="addToWishlist('${product.id}', this)">${heartIcon}</span>
            <img src="${product.Image}" alt="${product.Product_Name}" class="product-image">
            <p>${product.Product_Name}
              <span class="more-dots" onclick="toggleDescription('${product.Product_Name}')">...</span>
            </p>
            <div class="product-description" id="desc-${product.Product_Name}" style="display: none;">
              ${product.Description || 'No description available.'}
            </div>
            <p class="price">₹${product.Price}</p>
            <button type="button" class="Button" onclick="addToCart('${product.id}')">Add to Cart</button>
            <button type="button" class="Button" onclick="buyNow('${product.id}','${product.Product_Name}', '${product.Image}', '${product.Price}')">Buy Now</button>
          `;
          itemsContainer.appendChild(productElement);
        });
      } else {
        itemsContainer.innerHTML = "<p>No products found.</p>";
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      itemsContainer.innerHTML = "<p>Failed to load products.</p>";
    }
  });
});



window.toggleDescription = function(productName) {
  const description = document.getElementById(`desc-${productName}`);
  const productDiv = description.closest('.product'); 

  if (description.style.display === "none" || description.style.display === "") {
    description.style.display = "block"; 
    description.style.maxHeight = description.scrollHeight + "px"; 
    productDiv.classList.add('show-description'); 
  } else {
    description.style.display = "none"; 
    description.style.maxHeight = "0"; 
    productDiv.classList.remove('show-description'); 
  }
}


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

window.addToWishlist = function(product_id, heartElement) {
  let token = localStorage.getItem('user');

  if (!token) {
    alert("Please Login first");
    return;
  }

  fetch('https://pet-world-fastapi-spsz.onrender.com/wishlist/addItem', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ product_id: product_id })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert(data.message);
      const isWishlisted = heartElement.textContent === "❤️";
      heartElement.textContent = isWishlisted ? "♡" : "❤️";

      if (isWishlisted) {
        wishlistedProductIds = wishlistedProductIds.filter(id => id !== product_id);
      } else {
        wishlistedProductIds.push(product_id);
      }
    } else {
      alert("Failed to update wishlist.");
    }
  })
  .catch(error => {
    console.error("Error updating wishlist:", error);
    alert("An error occurred.");
  });
}

window.buyNow = function(productId, name, image, price) {
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