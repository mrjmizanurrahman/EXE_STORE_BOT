const TelegramBot = require('8822869700:AAF0MTJtB220QQnzak0axkchaW3pcLC8CGE');

// Store the bot token in the TELEGRAM_BOT_TOKEN environment variable.
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error('Missing TELEGRAM_BOT_TOKEN environment variable.');
}

const bot = new TelegramBot(token, { polling: true });

// ইউজার ব্যালেন্স ট্র্যাকিং (Database হিসেবে MongoDB/Supabase ব্যবহার করা ভালো)
const userBalances = {};

// /start কমান্ড দিলে মেইন রিপ্লাই কিবোর্ড আসবে
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const mainMenuMarkup = {
    reply_markup: {
      keyboard: [
        [{ text: "🖥️ Buy Proxy" }, { text: "🛡️ Buy VPN" }],
        [{ text: "✉️ Buy Mails" }, { text: "🤖 META AI" }],
        [{ text: "💎 2FA KEY" }, { text: "📩 Mail OTP" }],
        [{ text: "💰 Add Money" }, { text: "👤 Profile" }]
      ],
      resize_keyboard: true,
      persistent: true
    }
  };

  bot.sendMessage(
    chatId,
    `👋 **Welcome to EXE_SHOP_BOT!**\n\nনিচের মেনু থেকে আপনার প্রয়োজনীয় সার্ভিসটি বেছে নিন:`,
    { parse_mode: 'Markdown', ...mainMenuMarkup }
  );
});

// মূল বাটনগুলোর রেসপন্স (Handling Main Buttons)
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // ১. Buy Mails (ইনলাইন সাব-মেনু)
  if (text === '✉️ Buy Mails') {
    bot.sendMessage(chatId, '📧 **Select a Package from Mails:**', {
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
  }

  // ২. Add Money (ডিপোজিট অপশন)
  else if (text === '💰 Add Money') {
    bot.sendMessage(
      chatId,
      `💰 **Add Money Info**\n\n` +
      `● **Method:** Binance\n` +
      `● **Send To:** \`986876791\`\n\n` +
      `💲 **Enter Amount (USDT / USD):**\n\n` +
      `পেমেন্ট শেষ করে Transaction ID বা স্ক্রিনশট এখানে সেন্ড করুন।`,
      { parse_mode: 'Markdown' }
    );
  }

  // ৩. Buy VPN
  else if (text === '🛡️ Buy VPN') {
    bot.sendMessage(chatId, '🔴 **All vpn stock out right now!**\n\nস্টক আপডেট হলে আবার জানানো হবে।');
  }

  // ৪. Mail OTP: never request passwords, tokens, or verification codes.
  else if (text === '📩 Mail OTP') {
    bot.sendMessage(
      chatId,
      '🔐 নিরাপত্তার জন্য এখানে password, refresh token, client ID বা OTP পাঠাবেন না। আপনার ইমেইল সেবার অফিসিয়াল recovery/support পদ্ধতি ব্যবহার করুন।'
    );
  }

  // ৫. Profile (ইউজার ব্যালেন্স ও ইনফো)
  else if (text === '👤 Profile') {
    const balance = userBalances[chatId] || 0.00;
    bot.sendMessage(
      chatId,
      `👤 **আপনার প্রোফাইল വിവരন:**\n\n` +
      `🆔 **User ID:** \`${chatId}\`\n` +
      `💵 **Current Balance:** $${balance.toFixed(2)} USD\n` +
      `📦 **Total Orders:** 0`,
      { parse_mode: 'Markdown' }
    );
  }

  // ৬. Buy Proxy
  else if (text === '🖥️ Buy Proxy') {
    bot.sendMessage(chatId, '🌐 **Proxy Stock:**\n\n● Residential Proxy - Available\n● Datacenter Proxy - Available');
  }

  // ৭. META AI
  else if (text === '🤖 META AI') {
    bot.sendMessage(chatId, '🤖 **Meta AI Active!**\n\nআপনার যেকোনো প্রশ্ন এখানে লিখুন।');
  }

  // ৮. 2FA: do not collect secret keys or generate codes for others.
  else if (text === '💎 2FA KEY') {
    bot.sendMessage(chatId, '🔐 আপনার 2FA secret key বা verification code কাউকে পাঠাবেন না। নিজের ডিভাইসের authenticator app বা সংশ্লিষ্ট সেবার official recovery ব্যবহার করুন।');
  }
});

// ইনলাইন বাটনগুলোর রেসপন্স (Inline Callback Query Handling)
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;

  if (data === 'buy_hotmail' || data === 'buy_outlook' || data === 'buy_outlook_fr') {
    bot.answerCallbackQuery(query.id, { text: 'স্টক চেক করা হচ্ছে...' });
    bot.sendMessage(chatId, `⚠️ **বর্তমানে এই সার্ভিসটি আউট অফ স্টক!**`);
  } else if (data === 'close_menu') {
    bot.deleteMessage(chatId, messageId);
  }
});
