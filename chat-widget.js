
document.addEventListener("DOMContentLoaded", function () {
(function () {
    // Define API URL and headers
    const apiUrl = "http://localhost:8000/search_faq/";
    const headers = {
      accept: "application/json",
      "Content-Type": "application/json",
    };
  
    // Add chat widget HTML to the page
    const chatWidgetHTML = `
      <div class="chat-widget-container" id="chatWidget">
        <div class="chat-header" onclick="toggleChat()">Chat with Us</div>
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-input-container">
          <input type="text" id="chatInput" class="chat-input" placeholder="Type a message..." onkeydown="handleKey(event)">
          <button class="chat-send-btn" onclick="sendMessage()">Send</button>
        </div>
      </div>
      <button class="chat-toggle-btn" onclick="toggleChat()">Chat</button>
    `;
    document.body.insertAdjacentHTML("beforeend", chatWidgetHTML);
  
    // Add styles to the page
    const chatWidgetStyles = document.createElement("style");
    chatWidgetStyles.textContent = `
      .chat-widget-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 320px;
        max-width: 90%;
        background-color: #fefefe;
        border-radius: 15px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        display: none;
        flex-direction: column;
        overflow: hidden;
        font-family: Arial, sans-serif;
        z-index: 9999;
        resize: both;
        overflow: auto;
        min-width: 40%;
        min-height: 80%;
        max-height: 80vh;
      }
      .chat-header {
        background-color: #0078ff;
        color: #ffffff;
        padding: 12px;
        font-weight: bold;
        text-align: center;
        font-size: 1.1em;
        cursor: pointer;
        user-select: none;
      }
      .chat-messages {
        padding: 12px;
        flex-grow: 1;
        overflow-y: auto;
        background-color: #f4f4f9;
        max-height: calc(100% - 110px);
      }
      .message {
        margin: 8px 0;
        padding: 10px 14px;
        border-radius: 12px;
        line-height: 1.4;
        max-width: 75%;
        word-wrap: break-word;
      }
      .user-message {
        background-color: #0078ff;
        color: #ffffff;
        margin-left: auto;
        border-top-right-radius: 0;
      }
      .bot-message {
        background-color: #e9ecef;
        color: #333333;
        margin-right: auto;
        border-top-left-radius: 0;
      }
      .chat-input-container {
        display: flex;
        border-top: 1px solid #ddd;
        background-color: #ffffff;
      }
      .chat-input {
        flex: 1;
        padding: 12px;
        border: none;
        outline: none;
        font-size: 1em;
      }
      .chat-send-btn {
        background-color: #0078ff;
        color: #ffffff;
        border: none;
        padding: 0 20px;
        cursor: pointer;
        font-weight: bold;
        font-size: 1em;
        transition: background-color 0.3s;
      }
      .chat-send-btn:hover {
        background-color: #005bb5;
      }
      .chat-toggle-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 24px;
        background-color: #0078ff;
        color: #ffffff;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-weight: bold;
        font-size: 1em;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        transition: background-color 0.3s;
        z-index: 9998;
      }
      .chat-toggle-btn:hover {
        background-color: #005bb5;
      }
    `;
    document.head.appendChild(chatWidgetStyles);
  
    // Toggle chat widget visibility
    window.toggleChat = function () {
      const chatWidget = document.getElementById("chatWidget");
      chatWidget.style.display = chatWidget.style.display === "flex" ? "none" : "flex";
    };
  
    // Send message from input
    window.sendMessage = async function () {
      const chatInput = document.getElementById("chatInput");
      const messageText = chatInput.value.trim();
      if (messageText) {
        addMessage(messageText, "user-message");
        chatInput.value = "";
  
        const payload = { query: messageText, mode: "chat" };
  
        try {
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload),
          });
          if (response.ok) {
            const data = await response.json();
            const botReply = data.textResponse || "No response";
            addMessage(botReply, "bot-message");
          } else {
            addMessage("Error: Could not connect to chatbot.", "bot-message");
          }
        } catch (error) {
          console.error("API error:", error);
          addMessage("Error: Could not connect to chatbot.", "bot-message");
        }
      }
    };
  
    // Add message to chat
    function addMessage(text, className) {
      const messageElem = document.createElement("div");
      messageElem.className = "message " + className;
      messageElem.textContent = text;
      document.getElementById("chatMessages").appendChild(messageElem);
      messageElem.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  
    // Handle Enter key to send message
    window.handleKey = function (event) {
      if (event.key === "Enter") {
        sendMessage();
      }
    };
  })();
});
  