// ===============================
// BLACK STRIVE - SCRIPT PRINCIPAL
// ===============================

// --------------------------------
// VARIÁVEIS
// --------------------------------

let cart = JSON.parse(localStorage.getItem("blackStriveCart")) || [];


// --------------------------------
// CARRINHO
// --------------------------------

function saveCart() {
  localStorage.setItem("blackStriveCart", JSON.stringify(cart));
}

function updateCartCount() {
  const countElements = document.querySelectorAll(".cart-count");

  countElements.forEach(element => {
    element.textContent = cart.length;
  });
}

function addToCart(name, price) {
  cart.push({
    name: name,
    price: Number(price)
  });

  saveCart();
  updateCartCount();

  alert("Produto adicionado ao carrinho! 🛒");
}

function addProductFromCard(button, name, price) {
  addToCart(name, price);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartCount();
  renderCart();
}

function renderCart() {
  const cartContainer = document.getElementById("cartItems");

  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
    return;
  }

  cartContainer.innerHTML = "";

  cart.forEach((item, index) => {
    const div = document.createElement("div");

    div.className = "cart-item";

    div.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <p>R$ ${Number(item.price).toFixed(2)}</p>
      </div>

      <button onclick="removeFromCart(${index})">
        Remover
      </button>
    `;

    cartContainer.appendChild(div);
  });
}

function openCart() {
  const cartElement = document.getElementById("cart");

  if (cartElement) {
    cartElement.classList.remove("hidden");
    renderCart();
  }
}

function closeCart() {
  const cartElement = document.getElementById("cart");

  if (cartElement) {
    cartElement.classList.add("hidden");
  }
}


// --------------------------------
// CHAT
// --------------------------------

function getChatSessionId() {
  let sessionId = localStorage.getItem("blackStriveChatSession");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("blackStriveChatSession", sessionId);
  }

  return sessionId;
}

function addMessage(text, type) {
  const messagesContainer = document.getElementById("messages");

  if (!messagesContainer) return;

  const message = document.createElement("div");

  message.className = "message " + type;

  message.textContent = text;

  messagesContainer.appendChild(message);

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function openChat() {
  const chat = document.getElementById("chat");

  if (chat) {
    chat.classList.remove("hidden");
    loadAdminReplies();
  }
}

function closeChat() {
  const chat = document.getElementById("chat");

  if (chat) {
    chat.classList.add("hidden");
  }
}


// --------------------------------
// ENVIAR MENSAGEM DIGITADA
// --------------------------------

async function sendMessage(event) {
  event.preventDefault();

  const input = document.getElementById("chatInput");

  if (!input) return;

  const text = input.value.trim();

  if (!text) return;

  const sessionId = getChatSessionId();

  addMessage(text, "user");

  input.value = "";

  try {

    const { error } = await supabaseClient
      .from("messages")
      .insert([{
        customer_name: "Cliente",
        customer_email: "",
        message: text,
        sender: "customer",
        read: false,
        session_id: sessionId
      }]);

    if (error) {
      console.error("Erro ao enviar mensagem:", error);

      addMessage(
        "Não foi possível enviar sua mensagem. Tente novamente.",
        "bot"
      );

      return;
    }

    addMessage(
      "Mensagem enviada! 👊 Nossa equipe recebeu sua mensagem.",
      "bot"
    );

  } catch (error) {

    console.error("Erro de conexão:", error);

    addMessage(
      "Não foi possível conectar ao atendimento. Tente novamente.",
      "bot"
    );
  }
}


// --------------------------------
// MENSAGENS RÁPIDAS
// --------------------------------

async function quickMessage(text) {

  const sessionId = getChatSessionId();

  addMessage(text, "user");

  try {

    const { error } = await supabaseClient
      .from("messages")
      .insert([{
        customer_name: "Cliente",
        customer_email: "",
        message: text,
        sender: "customer",
        read: false,
        session_id: sessionId
      }]);

    if (error) {

      console.error("Erro ao enviar mensagem:", error);

      addMessage(
        "Não foi possível enviar sua mensagem. Tente novamente.",
        "bot"
      );

      return;
    }

    addMessage(
      "Mensagem enviada! 👊 Nossa equipe recebeu sua mensagem.",
      "bot"
    );

  } catch (error) {

    console.error("Erro de conexão:", error);

    addMessage(
      "Não foi possível conectar ao atendimento. Tente novamente.",
      "bot"
    );
  }
}


// --------------------------------
// CARREGAR RESPOSTAS DO ADMIN
// --------------------------------

async function loadAdminReplies() {

  const sessionId = localStorage.getItem("blackStriveChatSession");

  if (!sessionId) return;

  try {

    const { data, error } = await supabaseClient
      .rpc("get_chat_messages", {
        p_session_id: sessionId
      });

    if (error) {

      console.error("Erro ao carregar respostas:", error);

      return;
    }

    if (!data) return;

    if (!window.blackStriveSeenReplies) {
      window.blackStriveSeenReplies = new Set();
    }

    data
      .filter(msg => msg.sender === "admin")
      .forEach(msg => {

        if (window.blackStriveSeenReplies.has(msg.id)) {
          return;
        }

        window.blackStriveSeenReplies.add(msg.id);

        addMessage(msg.message, "bot");
      });

  } catch (error) {

    console.error("Erro ao buscar respostas:", error);
  }
}


// --------------------------------
// VERIFICAR RESPOSTAS AUTOMATICAMENTE
// --------------------------------

setInterval(function () {

  loadAdminReplies();

}, 3000);


// --------------------------------
// INICIALIZAÇÃO
// --------------------------------

document.addEventListener("DOMContentLoaded", function () {

  updateCartCount();

  renderCart();

  loadAdminReplies();

});
