/* =====================================================
   BLACK STRIVE
   SCRIPT PRINCIPAL
===================================================== */


let cart = [];


/* =====================================================
   CATEGORIAS
===================================================== */

function filterProducts(category) {

  const products =
    document.querySelectorAll(".product");


  const buttons =
    document.querySelectorAll(".category");


  buttons.forEach(function(button) {

    button.classList.remove("active");

  });


  const selectedButton =
    document.querySelector(
      `.category[data-category="${category}"]`
    );


  if (selectedButton) {

    selectedButton.classList.add("active");

  }


  products.forEach(function(product) {

    const categories =
      product.dataset.category
        .toLowerCase()
        .split(" ");


    if (category === "todos") {

      product.style.display = "";

      return;

    }


    if (categories.includes(category)) {

      product.style.display = "";

    } else {

      product.style.display = "none";

    }

  });


  document
    .getElementById("produtos")
    .scrollIntoView({
      behavior: "smooth"
    });

}


/* =====================================================
   CARRINHO
===================================================== */

function addToCart(
  name,
  price,
  size = ""
) {

  cart.push({

    name: name,

    price: price,

    size: size

  });


  updateCart();

  openCart();

}


function addProductFromCard(
  button,
  name,
  price
) {

  const product =
    button.closest(".product");


  const select =
    product.querySelector(".size");


  let size = "";


  if (select) {

    size = select.value;


    if (!size) {

      alert(
        "Escolha um tamanho antes de adicionar ao carrinho."
      );

      return;

    }

  }


  addToCart(
    name,
    price,
    size
  );

}


function updateCart() {

  const items =
    document.getElementById("cartItems");


  const count =
    document.getElementById("cartCount");


  const totalElement =
    document.getElementById("cartTotal");


  count.textContent =
    cart.length;


  items.innerHTML = "";


  let total = 0;


  if (cart.length === 0) {

    items.innerHTML =
      "<p>Seu carrinho está vazio.</p>";

  }


  cart.forEach(function(item, index) {

    total += item.price;


    const line =
      document.createElement("div");


    line.className =
      "cart-line";


    line.innerHTML = `

      <div>

        <strong>
          ${item.name}
        </strong>

        ${
          item.size
            ? `<br>Tamanho: ${item.size}`
            : ""
        }

        <br>

        R$ ${formatMoney(item.price)}

      </div>


      <button
        class="remove"
        onclick="removeFromCart(${index})"
      >
        Remover
      </button>

    `;


    items.appendChild(line);

  });


  totalElement.textContent =
    "R$ " + formatMoney(total);

}


function formatMoney(value) {

  return value
    .toFixed(2)
    .replace(".", ",");

}


function removeFromCart(index) {

  cart.splice(
    index,
    1
  );


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


/* =====================================================
   CHECKOUT
===================================================== */

function checkout() {

  if (cart.length === 0) {

    alert(
      "Seu carrinho está vazio."
    );

    return;

  }


  closeCart();


  const summary =
    document.getElementById(
      "checkoutSummary"
    );


  let html = "";

  let total = 0;


  cart.forEach(function(item) {

    total += item.price;


    html += `

      <div>

        ${item.name}

        ${
          item.size
            ? ` — ${item.size}`
            : ""
        }

        — R$ ${formatMoney(item.price)}

      </div>

    `;

  });


  html += `

    <hr>

    <strong>
      Total: R$ ${formatMoney(total)}
    </strong>

  `;


  summary.innerHTML =
    html;


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
    document.getElementById(
      "customerName"
    ).value.trim();


  const phone =
    document.getElementById(
      "customerPhone"
    ).value.trim();


  if (!name || !phone) {

    alert(
      "Digite pelo menos seu nome e telefone."
    );

    return;

  }


  document
    .getElementById("checkoutForm")
    .classList.add("hidden");


  document
    .getElementById("orderDone")
    .classList.remove("hidden");


  document.getElementById(
    "orderMessage"
  ).textContent =
    `Obrigado, ${name}! Recebemos seus dados. Em breve entraremos em contato.`;

}


/* =====================================================
   CHAT
===================================================== */

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


function addMessage(
  text,
  type
) {

  const messages =
    document.getElementById(
      "messages"
    );


  const message =
    document.createElement("div");


  message.className =
    `message ${type}`;


  message.textContent =
    text;


  messages.appendChild(
    message
  );


  messages.scrollTop =
    messages.scrollHeight;

}


function sendMessage(event) {

  event.preventDefault();


  const input =
    document.getElementById(
      "chatInput"
    );


  const text =
    input.value.trim();


  if (!text) {

    return;

  }


  addMessage(
    text,
    "user"
  );


  input.value = "";


  setTimeout(function() {

    addMessage(
      "Mensagem recebida! 👊 Para falar diretamente com a BLACK STRIVE, use nosso WhatsApp.",
      "bot"
    );

  }, 500);

}


function quickMessage(text) {

  addMessage(
    text,
    "user"
  );


  setTimeout(function() {

    addMessage(
      "Claro! 👊 Vamos ajudar você. Para atendimento direto, fale conosco pelo WhatsApp.",
      "bot"
    );

  }, 500);

}


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    updateCart();

  }
);
