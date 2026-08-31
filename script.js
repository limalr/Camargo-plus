let cart = [];


/* =========================
   CATEGORIAS
========================= */

function filterProducts(category, button) {

  const products = document.querySelectorAll(".product");

  const buttons = document.querySelectorAll(".category");


  buttons.forEach(function(btn) {

    btn.classList.remove("active");

  });


  if (button) {

    button.classList.add("active");

  }


  products.forEach(function(product) {

    const productCategories =
      product.dataset.category || "";


    if (
      category === "todos" ||
      productCategories.includes(category)
    ) {

      product.style.display = "";

    } else {

      product.style.display = "none";

    }

  });

}


/* =========================
   CARRINHO
========================= */

function addToCart(name, price, size = "") {

  cart.push({

    name: name,

    price: price,

    size: size

  });


  updateCart();

  openCart();

}


function addProductFromCard(button, name, price) {

  const product =
    button.closest(".product");


  const sizeSelect =
    product.querySelector(".size");


  let size = "";


  if (sizeSelect) {

    size = sizeSelect.value;


    if (!size) {

      alert("Escolha um tamanho antes de adicionar ao carrinho.");

      return;

    }

  }


  addToCart(name, price, size);

}


function updateCart() {

  const cartItems =
    document.getElementById("cartItems");


  const cartCount =
    document.getElementById("cartCount");


  const cartTotal =
    document.getElementById("cartTotal");


  cartCount.textContent = cart.length;


  cartItems.innerHTML = "";


  let total = 0;


  if (cart.length === 0) {

    cartItems.innerHTML =
      "<p>Seu carrinho está vazio.</p>";

  }


  cart.forEach(function(item, index) {

    total += item.price;


    const line =
      document.createElement("div");


    line.className = "cart-line";


    line.innerHTML = `

      <div>

        <strong>${item.name}</strong>

        ${
          item.size
            ? `<br><small>Tamanho: ${item.size}</small>`
            : ""
        }

        <br>

        R$ ${item.price.toFixed(2).replace(".", ",")}

      </div>


      <button
        class="remove"
        onclick="removeFromCart(${index})"
      >
        Remover
      </button>

    `;


    cartItems.appendChild(line);

  });


  cartTotal.textContent =
    "R$ " +
    total.toFixed(2).replace(".", ",");

}


function removeFromCart(index) {

  cart.splice(index, 1);

  updateCart();

}


function openCart() {

  document
    .getElementById("cartPanel")
    .classList.add("open");

}


function closeCart() {

  document
    .getElementById("cartPanel")
    .classList.remove("open");

}


/* =========================
   CHECKOUT
========================= */

function checkout() {

  if (cart.length === 0) {

    alert("Seu carrinho está vazio.");

    return;

  }


  closeCart();


  const summary =
    document.getElementById("checkoutSummary");


  let html = "";


  let total = 0;


  cart.forEach(function(item) {

    total += item.price;


    html += `
      <div>
        ${item.name}
        ${item.size ? " — " + item.size : ""}
        — R$ ${item.price.toFixed(2).replace(".", ",")}
      </div>
    `;

  });


  html += `
    <hr>
    <strong>
      Total: R$ ${total.toFixed(2).replace(".", ",")}
    </strong>
  `;


  summary.innerHTML = html;


  document
    .getElementById("checkoutModal")
    .classList.remove("hidden");

}


function closeCheckout() {

  document
    .getElementById("checkoutModal")
    .classList.add("hidden");

}


function finishOrder(event) {

  event.preventDefault();


  const name =
    document.getElementById("customerName").value;


  if (!name) {

    alert("Digite seu nome.");

    return;

  }


  document
    .getElementById("checkoutForm")
    .classList.add("hidden");


  document
    .getElementById("orderDone")
    .classList.remove("hidden");


  document.getElementById("orderMessage").textContent =
    "Obrigado, " +
    name +
    "! Recebemos seu pedido. Em breve entraremos em contato.";

}


/* =========================
   CHAT
========================= */

function openChat() {

  document
    .getElementById("chat")
    .classList.remove("hidden");

}


function closeChat() {

  document
    .getElementById("chat")
    .classList.add("hidden");

}


function sendMessage(event) {

  event.preventDefault();


  const input =
    document.getElementById("chatInput");


  const message =
    input.value.trim();


  if (!message) {

    return;

  }


  addMessage(message, "user");


  input.value = "";


  setTimeout(function() {

    addMessage(
      "Obrigado pela mensagem! 👋 Em breve a BLACK STRIVE poderá responder você.",
      "bot"
    );

  }, 500);

}


function addMessage(text, type) {

  const messages =
    document.getElementById("messages");


  const message =
    document.createElement("div");


  message.className =
    "message " + type;


  message.textContent = text;


  messages.appendChild(message);


  messages.scrollTop =
    messages.scrollHeight;

}


function quickMessage(text) {

  addMessage(text, "user");


  setTimeout(function() {

    addMessage(
      "Claro! Vamos ajudar você com isso. 👊",
      "bot"
    );

  }, 400);

}


/* =========================
   INICIAR
========================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    updateCart();

  }
);
