require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const github = require('./modules/github');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Bot commands and descriptions
bot.setMyCommands([]);

// Store user preferences (in memory - consider using a database for production)
const userPreferences = new Map();

// Updated supported languages with more trending tech
const supportedLanguages = {
    // Frontend
    'javascript': '📜 JavaScript',
    'typescript': '🔷 TypeScript',
    'react': '⚛️ React',
    'nextjs': '▲ Next.js',
    'vue': '💚 Vue',
    'angular': '🔺 Angular',
    'svelte': '🔥 Svelte',
    
    // Styling
    'tailwind': '🎨 Tailwind',
    'css': '🎨 CSS',
    
    // Backend
    'python': '🐍 Python',
    'java': '☕ Java',
    'go': '🐹 Go',
    'rust': '⚙️ Rust',
    'nodejs': '💚 Node.js',
    'deno': '🦕 Deno',
    'php': '🐘 PHP',
    
    // Mobile
    'kotlin': '🤖 Kotlin',
    'swift': '🍎 Swift',
    'flutter': '💙 Flutter',
    'reactnative': '📱 React Native',
    
    // Other
    'cpp': '⚡ C++',
    'c#': '🎯 C#',
    'ruby': '💎 Ruby',
    'solidity': '💎 Solidity',
    'ai': '🤖 AI/ML',
    'blockchain': '⛓️ Blockchain'
};

// Updated start command without auto-fetching
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.first_name;
    
    const welcomeMessage = `
Hello ${username}! 👋

I'm your GitHub Trending Bot. I help you discover trending repositories on GitHub across various programming languages and technologies.

Current language: ${supportedLanguages[userPreferences.get(chatId) || 'javascript']}

Use the buttons below to get started! 🚀
    `;
    
    // Create keyboard with main commands
    const keyboard = {
        keyboard: [
            [{ text: '📊 Trending Repos' }, { text: '🔄 Change Language' }],
            [{ text: '❓ Help & Info' }]
        ],
        resize_keyboard: true,
        persistent: true,
        remove_keyboard: false
    };
    
    await bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
    });
});

// Handle keyboard button clicks
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    
    switch(msg.text) {
        case '📊 Trending Repos':
            await sendTrendingRepos(chatId);
            break;
            
        case '🔄 Change Language':
            await showLanguageSelection(chatId);
            break;
            
        case '❓ Help & Info':
            await sendHelpMessage(chatId);
            break;
    }
});

// Updated help message
async function sendHelpMessage(chatId) {
    const currentLang = userPreferences.get(chatId) || 'javascript';
    const helpMessage = `
*GitHub Trending Bot Guide* 🚀

*Main Features:*
• View trending repositories
• Choose from ${Object.keys(supportedLanguages).length} programming languages
• Daily updated rankings

*Current Settings:*
• Language: ${supportedLanguages[currentLang]}

*Categories Available:*
• Frontend: JavaScript, TypeScript, React, Next.js, Vue, etc.
• Backend: Python, Java, Go, Rust, Node.js, etc.
• Mobile: Flutter, React Native, Swift, Kotlin
• And many more!

*Tips:*
• Use the buttons below for easy navigation
• Trending repos are updated daily
• Star counts show real-time popularity

*Need Help?*
Contact: @HOTHEAD01TH
    `;
    
    await bot.sendMessage(chatId, helpMessage, { 
        parse_mode: 'Markdown',
        disable_web_page_preview: true
    });
}

// Function to show language selection
async function showLanguageSelection(chatId) {
    const currentLang = userPreferences.get(chatId) || 'javascript';
    
    // Create keyboard layout with 2 languages per row
    const keyboard = {
        inline_keyboard: Object.entries(supportedLanguages)
            .reduce((rows, [key, value], index) => {
                if (index % 2 === 0) {
                    rows.push([{
                        text: `${value}${key === currentLang ? ' ✅' : ''}`,
                        callback_data: `lang:${key}`
                    }]);
                } else {
                    rows[rows.length - 1].push({
                        text: `${value}${key === currentLang ? ' ✅' : ''}`,
                        callback_data: `lang:${key}`
                    });
                }
                return rows;
            }, [])
    };

    await bot.sendMessage(
        chatId,
        `*Select Technology/Language*\n\nCurrent: ${supportedLanguages[currentLang]}`,
        {
            parse_mode: 'Markdown',
            reply_markup: keyboard
        }
    );
}

// Update github.js language mapping

// Handle /language command
bot.onText(/^\/language$/, async (msg) => {
    const chatId = msg.chat.id;
    const currentLang = userPreferences.get(chatId) || 'javascript';
    
    // Create keyboard layout with 2 languages per row
    const keyboard = {
        inline_keyboard: Object.entries(supportedLanguages)
            .reduce((rows, [key, value], index) => {
                if (index % 2 === 0) {
                    rows.push([{
                        text: `${value}${key === currentLang ? ' ✅' : ''}`,
                        callback_data: `lang:${key}`
                    }]);
                } else {
                    rows[rows.length - 1].push({
                        text: `${value}${key === currentLang ? ' ✅' : ''}`,
                        callback_data: `lang:${key}`
                    });
                }
                return rows;
            }, [])
    };

    await bot.sendMessage(
        chatId,
        `*Select Programming Language*\n\nCurrent: ${supportedLanguages[currentLang]}`,
        {
            parse_mode: 'Markdown',
            reply_markup: keyboard
        }
    );
});

// Handle language selection callback
bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    
    if (data.startsWith('lang:')) {
        const language = data.split(':')[1];
        userPreferences.set(chatId, language);
        
        await sendTrendingRepos(chatId);
    }
});

// Trending command
bot.onText(/\/trending/, async (msg) => {
    const chatId = msg.chat.id;
    await sendTrendingRepos(chatId);
});

// Function to send trending repos
async function sendTrendingRepos(chatId) {
    const language = userPreferences.get(chatId) || 'javascript';
    
    try {
        await bot.sendMessage(chatId, `Fetching trending ${language} repositories...`);
        
        const trendingRepos = await github.fetchTrendingRepositories(language);
        
        if (trendingRepos) {
            const message = `
🌟 GitHub Trending ${language.toUpperCase()} Repositories 🌟

${trendingRepos}

_Updated: ${new Date().toLocaleString()}_
Bot by @HOTHEAD01TH
            `;
            
            await bot.sendMessage(chatId, message, { 
                parse_mode: 'Markdown',
                disable_web_page_preview: true 
            });
        } else {
            await bot.sendMessage(chatId, '❌ Sorry, failed to fetch trending repositories. Please try again later.');
        }
    } catch (error) {
        console.error('Error:', error);
        await bot.sendMessage(chatId, '❌ An error occurred while fetching repositories.');
    }
}

// Handle errors
bot.on('error', (error) => {
    console.error('Bot error:', error);
});

// Log that bot is running
console.log('Bot is running...');
