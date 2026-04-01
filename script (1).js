const chatBody  = document.getElementById("chat-body");
const userInput = document.getElementById("user-input");
const sendBtn   = document.getElementById("send-btn");

// Simple rule‑based responses
const responses = {
  hello: "Hi there! How can I help you today?",
  hi: "Hey! What's up?",
  who: "I'm just a simple bot, but I'm here to chat with you!",
  name: "I'm your friendly chat bot!",
  college: "Nice! What branch are you studying?",
  project: "Cool! Building projects is a great way to learn.",
  default: "Hmm, I'm not sure how to answer that yet. Try something like 'hello' or 'how are you?'"
};

function addMessage(text, isUser) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("msg");
  msgDiv.classList.add(isUser ? "user" : "bot");

  const p = document.createElement("p");
  p.textContent = text;
  msgDiv.appendChild(p);

  chatBody.appendChild(msgDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function getBotReply(input) {
  const lower = input.toLowerCase();

  for (const key in responses) {
    if (key === "default") continue;
    if (lower.includes(key)) {
      return responses[key];
    }
  }
  return responses.default;
}

function handleSend() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, true);   // user message
  userInput.value = "";

  // thinking delay
  setTimeout(() => {
    const reply = getBotReply(text);
    addMessage(reply, false); // bot reply
  }, 500 + Math.random() * 400);
}

sendBtn.addEventListener("click", handleSend);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSend();
  }
});
