document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addProductForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const product = {
      Product_Name: document.getElementById("productName").value,
      Price: parseFloat(document.getElementById("productPrice").value),
      Description: document.getElementById("description").value,
      Category: document.getElementById("productCategory").value,
      Image: document.getElementById("productImage").value || null
    };

    console.log(product.Category);

    try {
      const response = await fetch("https://pet-world-fastapi-spsz.onrender.com/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
      });

      const result = await response.json();
      alert(result.message);

      
      form.reset();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  });
});
