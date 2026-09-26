const messages = document.getElementById('messages');
const input = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

function addMessage(text, type) {
  const bubble = document.createElement('div');
  bubble.className = `message ${type}-message`;
  bubble.append(document.createTextNode(text));
  const time = document.createElement('time');
  time.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  bubble.append(time);
  messages.append(bubble);
  messages.scrollTop = messages.scrollHeight;
}

const replies = {
  'Buy Proxy': '🖥️ Choose a proxy package: Residential, IPv4 or IPv6.\nReply with the package you want and our bot will show available plans.',
  'Buy VPN': '🛡️ VPN packages are ready. Choose a location and subscription length to continue.',
  'Buy Mails': '📩 Choose an email package: Hotmail, Outlook.fr or Outlook.',
  'META AI': '📸 META AI accounts are available. Send a message to support for current stock and pricing.',
  '2FA KEY': '🔐 Choose a 2FA key package. We’ll show the available options and prices here.',
  'Mail OTP': '💬 Mail OTP selected. Choose a service to check available OTP mailboxes.',
  'Add Money': '💰 To add money, choose a payment method and send the amount you want to deposit. Contact support if you need help.',
  'Profile': '👤 Your profile\nBalance: $0.00\nOrders: 0\nUse Add Money to fund your account.'
};

function sendText(text) {
  const clean = text.trim();
  if (!clean) return;
  addMessage(clean, 'user');
  input.value = '';
  if (replies[clean]) {
    window.setTimeout(() => addMessage(replies[clean], 'bot'), 250);
  }
}

document.querySelectorAll('.key').forEach((button) => {
  button.addEventListener('click', () => sendText(button.dataset.action));
});

document.getElementById('menuButton').addEventListener('click', () => {
  addMessage('🛍️ Use the buttons below to browse products, add money or view your profile.', 'bot');
});

sendButton.addEventListener('click', () => sendText(input.value));
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') sendText(input.value);
});
input.addEventListener('input', () => {
  sendButton.style.display = input.value ? 'block' : 'none';
});
