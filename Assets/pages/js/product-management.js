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
      const response = await fetch("http://127.0.0.1:8000/products/create", {
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
