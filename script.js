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

fetch('http://localhost:8000/category/')
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

let token = localStorage.getItem("user")

function updateNavbarCartCount() {
  fetch("http://127.0.0.1:8000/cart/", {
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





document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  const nameRegex = /^[A-Za-z]+( [A-Za-z]+)?$/;

  // Validate the name
  if (!nameRegex.test(name)) {
    alert('Name must contain only letters and a single space between first and last name (if applicable).');
    return; 
  }

  if (name.length < 3) {
    alert('Name must be at least 3 characters long.');
    return; 
  }


  console.log('Form submitted with:', {
    name,
    email,
    message
  });

  alert('Thank you for your message!');

  document.getElementById('contact-form').reset();
});




document.addEventListener("DOMContentLoaded", () => {
  updateNavbarCartCount();
});
