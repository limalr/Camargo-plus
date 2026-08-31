let cart = [];

const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

function openCart() {
  cartPanel.classList.add("open");
}

function closeCart() {
  cartPanel.classList.remove("open");
}

function addToCart(name, price) {
  cart.push({
    name: name,
    price: Number(price)
  });

  updateCart();
  openCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p>Seu carrinho está vazio.</p>
    `;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    const line = document.createElement("div");
    line.className = "cart-line";

    line.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <br>
        R$ ${item.price.toFixed(2).replace(".", ",")}
      </div>

      <button class="remove" onclick="removeFromCart(${index})">
        Remover
      </button>
    `;

    cartItems.appendChild(line);
  });

  cartCount.textContent = cart.length;

  cartTotal.textContent =
    "R$ " + total.toFixed(2).replace(".", ",");
}

function checkout() {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  document.getElementById("checkoutModal").classList.remove("hidden");

  const summary = document.getElementById("checkoutSummary");

  let html = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price;

    html += `
      <div>
        ${item.name} — R$ ${item.price
          .toFixed(2)
          .replace(".", ",")}
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
}

function closeCheckout() {
  document.getElementById("checkoutModal").classList.add("hidden");
}

function finishOrder(event) {
  event.preventDefault();

  const name = document.getElementById("customerName").value;

  document.getElementById("checkoutForm").classList.add("hidden");

  document.getElementById("orderDone").classList.remove("hidden");

  document.getElementById("orderMessage").textContent =
    `Obrigado, ${name}! Seu pedido foi recebido com sucesso.`;

  cart = [];
  updateCart();
}

function openRegister() {
  document.getElementById("registerModal").classList.remove("hidden");
}

function closeRegister() {
  document.getElementById("registerModal").classList.add("hidden");
}

function registerUser(event) {
  event.preventDefault();

  const name = document.getElementById("registerName").value;

  alert(
    `Cadastro realizado com sucesso, ${name}!`
  );

  closeRegister();
}

function openChat() {
  document.getElementById("chat").classList.remove("hidden");
}

function closeChat() {
  document.getElementById("chat").classList.add("hidden");
}

function sendMessage(event) {
  event.preventDefault();

  const input = document.getElementById("chatInput");
  const message = input.value.trim();

  if (!message) return;

  addMessage(message, "user");

  input.value = "";

  setTimeout(() => {
    botReply(message);
  }, 500);
}

function addMessage(text, type) {
  const messages = document.getElementById("messages");

  const message = document.createElement("div");

  message.className = `message ${type}`;

  message.textContent = text;

  messages.appendChild(message);

  messages.scrollTop = messages.scrollHeight;
}

function botReply(message) {
  const text = message.toLowerCase();

  let response =
    "Olá! Posso ajudar com produtos, pedidos, cadastro e informações sobre a loja.";

  if (
    text.includes("produto") ||
    text.includes("produtos")
  ) {
    response =
      "Você pode conferir nossos produtos na seção Loja. É só escolher o produto e adicionar ao carrinho.";
  }

  else if (
    text.includes("preço") ||
    text.includes("preco") ||
    text.includes("valor")
  ) {
    response =
      "Os preços estão disponíveis diretamente nos cards dos produtos.";
  }

  else if (
    text.includes("pedido") ||
    text.includes("comprar")
  ) {
    response =
      "Para fazer um pedido, adicione os produtos ao carrinho e clique em Finalizar pedido.";
  }

  else if (
    text.includes("cadastro") ||
    text.includes("cadastrar")
  ) {
    response =
      "Você pode fazer seu cadastro clicando no botão de cadastro no menu.";
  }

  else if (
    text.includes("olá") ||
    text.includes("ola") ||
    text.includes("oi")
  ) {
    response =
      "Olá! 👋 Seja bem-vindo! Como posso ajudar?";
  }

  addMessage(response, "bot");
}

function quickMessage(text) {
  addMessage(text, "user");

  setTimeout(() => {
    botReply(text);
  }, 400);
}

document.addEventListener("DOMContentLoaded", () => {
  updateCart();
});
