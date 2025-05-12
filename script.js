let currentIndex = 0;

function showSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');

  if (index >= slides.length) currentIndex = 0;
  if (index < 0) currentIndex = slides.length - 1;

  slides.forEach(slide => (slide.style.display = 'none'));
  dots.forEach(dot => dot.classList.remove('active'));

  slides[currentIndex].style.display = 'block';
  dots[currentIndex].classList.add('active');
}

function nextSlide() {
  currentIndex++;
  showSlide(currentIndex);
}

function prevSlide() {
  currentIndex--;
  showSlide(currentIndex);
}

function createDots() {
  const dotsContainer = document.querySelector('.dots');
  const slides = document.querySelectorAll('.slide');

  slides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.addEventListener('click', () => {
      currentIndex = index;
      showSlide(currentIndex);
    });
    dotsContainer.appendChild(dot);
  });
}

document.querySelector('.prev').addEventListener('click', prevSlide);
document.querySelector('.next').addEventListener('click', nextSlide);


createDots();
showSlide(currentIndex);
setInterval(nextSlide, 5000);



// display categories

fetch('https://pet-world-fastapi-spsz.onrender.com/category/')
.then(response => response.json())
.then(data => {
  const categoriesContainer = document.getElementById("categories");
  data.forEach(category => {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("allproducts");
    categoryDiv.innerHTML = `
      <img src="${category.image}" alt="${category.name}" class="product_img">
      <p>${category.name}</p>
    `;

    categoryDiv.addEventListener("click", () => {
      window.location.href = `./Assets/pages/html/products.html?category=${encodeURIComponent(category.name)}`;
    });

    categoriesContainer.appendChild(categoryDiv);
  });
})
.catch(error => console.error("Error fetching categories:", error));

// update cartCount

const token = localStorage.getItem("user")

function updateNavbarCartCount() {
  fetch("https://pet-world-fastapi-spsz.onrender.com/cart/", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    const cartCountEl = document.getElementById("cart-count");
    const items = data.cart_items


    if (!Array.isArray(items)) {
      cartCountEl.textContent = "0";
      return;
    }

    // Show only how many different products are there
    const uniqueItemCount = items.length;
    cartCountEl.textContent = uniqueItemCount;
  })
  .catch(error => {
    console.error("Error fetching cart count:", error);
  });
}

let login = document.getElementById("login")
if(token){
  login.style.display = "none";
}


let wishlistedProductIds = [];




async function loadBestsellers() {
  try {
    const response = await fetch("https://pet-world-fastapi-spsz.onrender.com/order/bestseller");

    if (!response.ok) {
      throw new Error("Failed to fetch bestsellers");
    }

    const data = await response.json();

    const container = document.getElementById("bestsellers");
    container.innerHTML = ""; 

    data.forEach(product => {
      const isWishlisted = wishlistedProductIds.includes(product.product_id);
      const heartIcon = isWishlisted ? "❤️" : "♡";

      const div = document.createElement("div");
      div.classList.add("product");
      div.innerHTML = `
        <span class="wishlist-heart" onclick="addToWishlist('${product.product_id}', this)">${heartIcon}</span>
        <img src="${product.image_url}" alt="${product.name}" class="product-image">
        <p>${product.name} 
          <span class="more-dots" onclick="toggleDescription('${product.product_id}')">...</span>
        </p>
        <div class="product-description" id="desc-${product.product_id}" style="display: none;">
          ${product.description || 'No description available.'}
        </div>
        <p>₹${product.price}</p>
        <button type="button" class="Button" onclick="addToCart('${product.product_id}')">Add to Cart</button>
        <button type="button" class="Button" onclick="buyNow('${product.product_id}', '${product.name}', '${product.image_url}', '${product.price}')">Buy Now</button>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error("Error fetching bestsellers:", error);
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


function addToWishlist(product_id, heartElement) {

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







document.addEventListener("DOMContentLoaded", () => {
  updateNavbarCartCount();
  

  fetch("https://pet-world-fastapi-spsz.onrender.com/wishlist/", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    wishlistedProductIds = data.wishlist.map(item => item.product_id);
    loadBestsellers();
  })
  .catch(error => {
    console.error("Error fetching wishlist:", error);
    loadBestsellers();
  });


});
