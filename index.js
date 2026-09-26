const TelegramBot = require('node-telegram-bot-api');

// Render থেকে আপনার API TOKEN সংগ্রহ করবে
const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error("8822869700:AAH2V5W0thc_NouezmdWqRWY4P62UHH-y_0");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// মেইন মেনু কিবোর্ড
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

// Start Command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `👋 **Welcome to EXE_SHOP_BOT!**\n\nনিচের মেনু থেকে আপনার সার্ভিস নির্বাচন করুন:`,
    { parse_mode: 'Markdown', ...mainMenuMarkup }
  );
});

// Button Handlers
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

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
  } else if (text === '💰 Add Money') {
    bot.sendMessage(
      chatId,
      `💰 **Add Money Info**\n\n● **Method:** Binance\n● **Send To:** \`986876791\`\n\n💲 **Enter Amount (USDT / USD):**\n\nপেমেন্ট শেষে স্ক্রিনশট বা Transaction ID পাঠান।`,
      { parse_mode: 'Markdown' }
    );
  } else if (text === '🛡️ Buy VPN') {
    bot.sendMessage(chatId, '🔴 **All vpn stock out**\n\nবর্তমানে জিমেইল/ভিপিএন স্টক খালি আছে।');
  } else if (text === '📩 Mail OTP') {
    bot.sendMessage(
      chatId,
      `🌀 **অনুগ্রহ করে ফুল মেইল ইনফো দিন:**\n\n\`email|pass|refresh_token|client_id\``,
      { parse_mode: 'Markdown' }
    );
  } else if (text === '👤 Profile') {
    bot.sendMessage(
      chatId,
      `👤 **আপনার প্রোফাইল:**\n\n🆔 **User ID:** \`${chatId}\`\n💵 **Current Balance:** $0.00 USD`,
      { parse_mode: 'Markdown' }
    );
  } else if (text === '🖥️ Buy Proxy') {
    bot.sendMessage(chatId, '🌐 **Proxy Available:**\n\n● Residential Proxy\n● Datacenter Proxy');
  } else if (text === '🤖 META AI') {
    bot.sendMessage(chatId, '🤖 **Meta AI:** আপনার প্রশ্নটি লিখুন।');
  } else if (text === '💎 2FA KEY') {
    bot.sendMessage(chatId, '🔑 **2FA Key:** আপনার 2FA Secret Key টি দিন।');
  }
});

// Inline Button Actions
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  if (query.data === 'close_menu') {
    bot.deleteMessage(chatId, messageId);
  } else {
    bot.answerCallbackQuery(query.id, { text: 'স্টক খালি আছে!' });
  }
});
