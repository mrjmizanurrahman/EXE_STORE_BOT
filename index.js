const https = require('https');
const http = require('http');

// Set the real bot token in the TELEGRAM_BOT_TOKEN environment variable.
const token = process.env.TELEGRAM_BOT_TOKEN;8822869700:AAF0MTJtB220QQnzak0axkchaW3pcLC8CGE
const userBalances = Object.create(null);

function telegramRequest(method, payload, callback) {
  const body = JSON.stringify(payload || {});
  const request = https.request({
    hostname: 'api.telegram.org',
    path: '/bot' + token + '/' + method,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  }, (response) => {
    let responseBody = '';
    response.setEncoding('utf8');
    response.on('data', (chunk) => { responseBody += chunk; });
    response.on('end', () => {
      let result;
      try {
        result = JSON.parse(responseBody);
      } catch (error) {
        callback(new Error('Telegram returned an invalid response.'));
        return;
      }
      if (!result.ok) {
        callback(new Error(result.description || 'Telegram API request failed.'));
        return;
      }
      callback(null, result.result);
    });
  });

  request.setTimeout(35000, () => request.destroy(new Error('Telegram request timed out.')));
  request.on('error', callback);
  request.end(body);
}

function sendMessage(chatId, text, extra) {
  telegramRequest('sendMessage', Object.assign({ chat_id: chatId, text: text }, extra || {}), (error) => {
    if (error) console.error('Could not send Telegram message:', error.message);
  });
}

const mainMenu = {
  keyboard: [
    [{ text: '🖥️ Buy Proxy' }, { text: '🛡️ Buy VPN' }],
    [{ text: '✉️ Buy Mails' }, { text: '🤖 META AI' }],
    [{ text: '💎 2FA KEY' }, { text: '📩 Mail OTP' }],
    [{ text: '💰 Add Money' }, { text: '👤 Profile' }]
  ],
  resize_keyboard: true,
  is_persistent: true
};

function handleMessage(message) {
  if (!message || !message.chat || !message.text) return;
  const chatId = message.chat.id;
  const text = message.text;

  if (/^\/start(?:@\w+)?(?:\s|$)/.test(text)) {
    sendMessage(chatId,
      '👋 *Welcome to EXE_SHOP_BOT!*\n\nনিচের মেনু থেকে আপনার প্রয়োজনীয় সার্ভিসটি বেছে নিন:',
      { parse_mode: 'Markdown', reply_markup: mainMenu }
    );
  } else if (text === '✉️ Buy Mails') {
    sendMessage(chatId, '📧 *Select a Package from Mails:*', {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📧 Hotmail', callback_data: 'buy_hotmail' },
            { text: '📧 Outlook.fr', callback_data: 'buy_outlook_fr' }
          ],
          [{ text: '📧 Outlook', callback_data: 'buy_outlook' }],
          [{ text: '❌ Close', callback_data: 'close_menu' }]
        ]
      }
    });
  } else if (text === '💰 Add Money') {
    sendMessage(chatId,
      '💰 *Add Money Info*\n\n' +
      '● *Method:* Binance\n' +
      '● *Send To:* `986876791`\n\n' +
      '💲 *Enter Amount (USDT / USD):*\n\n' +
      'পেমেন্ট শেষ করে Transaction ID বা স্ক্রিনশট এখানে সেন্ড করুন।',
      { parse_mode: 'Markdown' }
    );
  } else if (text === '🛡️ Buy VPN') {
    sendMessage(chatId, '🔴 *All VPN stock out right now!*\n\nস্টক আপডেট হলে আবার জানানো হবে।', { parse_mode: 'Markdown' });
  } else if (text === '📩 Mail OTP') {
    sendMessage(chatId, '🔐 নিরাপত্তার জন্য এখানে password, refresh token, client ID বা OTP পাঠাবেন না। আপনার ইমেইল সেবার অফিসিয়াল recovery/support পদ্ধতি ব্যবহার করুন।');
  } else if (text === '👤 Profile') {
    const balance = userBalances[chatId] || 0;
    sendMessage(chatId,
      '👤 *আপনার প্রোফাইল বিবরণ:*\n\n' +
      '🆔 *User ID:* `' + chatId + '`\n' +
      '💵 *Current Balance:* $' + balance.toFixed(2) + ' USD\n' +
      '📦 *Total Orders:* 0',
      { parse_mode: 'Markdown' }
    );
  } else if (text === '🖥️ Buy Proxy') {
    sendMessage(chatId, '🌐 *Proxy Stock:*\n\n● Residential Proxy - Available\n● Datacenter Proxy - Available', { parse_mode: 'Markdown' });
  } else if (text === '🤖 META AI') {
    sendMessage(chatId, '🤖 *Meta AI Active!*\n\nআপনার যেকোনো প্রশ্ন এখানে লিখুন।', { parse_mode: 'Markdown' });
  } else if (text === '💎 2FA KEY') {
    sendMessage(chatId, '🔐 আপনার 2FA secret key বা verification code কাউকে পাঠাবেন না। নিজের ডিভাইসের authenticator app বা সংশ্লিষ্ট সেবার official recovery ব্যবহার করুন।');
  }
}

function handleCallback(query) {
  if (!query || !query.message || !query.message.chat) return;
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  if (query.data === 'buy_hotmail' || query.data === 'buy_outlook' || query.data === 'buy_outlook_fr') {
    telegramRequest('answerCallbackQuery', { callback_query_id: query.id, text: 'স্টক চেক করা হচ্ছে...' }, (error) => {
      if (error) console.error('Could not answer callback:', error.message);
    });
    sendMessage(chatId, '⚠️ *বর্তমানে এই সার্ভিসটি আউট অফ স্টক!*', { parse_mode: 'Markdown' });
  } else if (query.data === 'close_menu') {
    telegramRequest('answerCallbackQuery', { callback_query_id: query.id }, (error) => {
      if (error) console.error('Could not answer callback:', error.message);
    });
    telegramRequest('deleteMessage', { chat_id: chatId, message_id: messageId }, (error) => {
      if (error) console.error('Could not close menu:', error.message);
    });
  }
}

function pollTelegram(offset) {
  telegramRequest('getUpdates', {
    offset: offset,
    timeout: 25,
    allowed_updates: ['message', 'callback_query']
  }, (error, updates) => {
    if (error) {
      console.error('Telegram polling failed:', error.message);
      setTimeout(() => pollTelegram(offset), 5000);
      return;
    }

    let nextOffset = offset;
    updates.forEach((update) => {
      nextOffset = Math.max(nextOffset, update.update_id + 1);
      if (update.message) handleMessage(update.message);
      if (update.callback_query) handleCallback(update.callback_query);
    });
    pollTelegram(nextOffset);
  });
}

const port = Number(process.env.PORT) || 3000;
http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end(token
    ? 'Telegram bot is running. Check the server log for connection status.'
    : 'Server is running, but TELEGRAM_BOT_TOKEN is not set. Set it to connect the Telegram bot.');
}).listen(port, '0.0.0.0', () => {
  console.log('Web server is listening on port ' + port + '.');
  if (token) {
    pollTelegram(0);
  } else {
    console.log('Telegram bot is not connected: TELEGRAM_BOT_TOKEN is missing.');
  }
});
