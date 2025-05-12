let wishlistedProductIds = [];

document.addEventListener("DOMContentLoaded", () => {
  updateNavbarCartCount();

  const token = localStorage.getItem("user");
  if (!token) {
    loadCategoryProducts(); 
    return;
  }


  fetch("https://pet-world-fastapi-spsz.onrender.com/wishlist/", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    wishlistedProductIds = data.wishlist.map(item => item.product_id);
    loadCategoryProducts();
  })
  .catch(error => {
    console.error("Error fetching wishlist:", error);
    loadCategoryProducts();
  });
});

function loadCategoryProducts() {
  const params = new URLSearchParams(window.location.search);
  const categoryName = params.get("category");

  if (categoryName) {
    fetch(`https://pet-world-fastapi-spsz.onrender.com/products/get?categoryname=${categoryName}`)
      .then(response => response.json())
      .then(products => {
        const productContainer = document.getElementById("items");
        productContainer.innerHTML = "";

        products.forEach(product => {
          const isWishlisted = wishlistedProductIds.includes(product.id);
          const heartIcon = isWishlisted ? "❤️" : "♡";

          const div = document.createElement("div");
          div.classList.add("product");
          div.innerHTML = `
            <span class="wishlist-heart" onclick="addToWishlist('${product.id}', this)">${heartIcon}</span>
            <img src="${product.Image}" alt="${product.Product_Name}" class="product-image">
            <p>${product.Product_Name} 
              <span class="more-dots" onclick="toggleDescription('${product.Product_Name}')">...</span>
            </p>
            <div class="product-description" id="desc-${product.Product_Name}" style="display: none;">
              ${product.Description || 'No description available.'}
            </div>
            <p>₹${product.Price}</p>
            <button type="button" class="Button" onclick="addToCart('${product.id}')">Add to Cart</button>
            <button type="button" class="Button" onclick="buyNow('${product.id}','${product.Product_Name}', '${product.Image}', '${product.Price}')">Buy Now</button>
          `;
          productContainer.appendChild(div);
        });
      })
      .catch(error => console.error("Error fetching products:", error));
  }
}

function toggleDescription(productName) {
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

function addToCart(productId) {
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
      updateNavbarCartCount();
    } else {
      alert("Failed to add product to cart.");
    }
  })
  .catch(error => {
    console.error("Error adding product to cart:", error);
    alert("An error occurred.");
  });
}

function updateNavbarCartCount() {
  const token = localStorage.getItem("user");
  if (!token) return;

  fetch("https://pet-world-fastapi-spsz.onrender.com/cart/", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    const cartCountEl = document.getElementById("cart-count");
    const items = data.cart_items;

    if (!Array.isArray(items)) {
      cartCountEl.textContent = "0";
      return;
    }

    cartCountEl.textContent = items.length;
  })
  .catch(error => {
    console.error("Error fetching cart count:", error);
  });
}

function addToWishlist(product_id, heartElement) {
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


function buyNow(productId, name, image, price) {
  const product = [{
      id: productId,
      name: name,
      image: image,
      price: price
  }];

  localStorage.setItem("buyNowProduct", JSON.stringify(product));
  window.location.href = "../../../Assets/pages/html/buynow.html";
}


let token = localStorage.getItem("user")
let login = document.getElementById("login")
if(token){
  login.style.display = "none";
}

