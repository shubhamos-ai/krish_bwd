class ChatBot {
    constructor() {
        this.chatBody = document.getElementById('chat-body');
        this.userInput = document.getElementById('user-input');
        this.sendBtn = document.getElementById('send-btn');
        this.clearBtn = document.getElementById('clear-chat');
        this.backBtn = document.getElementById('back-btn');
        this.aiSelection = document.getElementById('ai-selection');
        this.chatContainer = document.getElementById('chat-container');
        this.aiTitle = document.getElementById('ai-title');
        this.currentAI = 'normal';
        this.wikipediaContainer = document.getElementById('wikipedia-container');
        this.wikipediaIframe = document.getElementById('wikipedia-iframe');
        this.wikipediaSearch = document.getElementById('wikipedia-search');
        this.searchWikipediaBtn = document.getElementById('search-wikipedia');
        this.closeWikipediaBtn = document.getElementById('close-wikipedia');
        this.closeWikipediaX = document.getElementById('close-wikipedia');
        
        this.jokes = [
            "Why don't scientists trust atoms? Because they make up everything!",
            "Why did the scarecrow win an award? He was outstanding in his field!",
            "Why don't eggs tell jokes? They'd crack up!",
            "What do you call a fake noodle? An impasta!",
            "Why did the math book look so sad? Because it had too many problems!"
        ];
        
        this.facts = [
            "Did you know? Honey never spoils. Archaeologists have found 3000-year-old honey that's still edible!",
            "Fun fact: Octopuses have three hearts and blue blood!",
            "Did you know? A group of flamingos is called a 'flamboyance'!",
            "Fun fact: Bananas are berries, but strawberries aren't!",
            "Did you know? The human brain uses about 20% of the body's total energy!"
        ];
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        this.clearBtn.addEventListener('click', () => this.clearChat());
        
        this.backBtn.addEventListener('click', () => this.showAISelection());
        
        // Handle AI selection
        document.querySelectorAll('.ai-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const aiType = e.currentTarget.dataset.ai;
                this.switchAI(aiType);
            });
        });
        
        this.searchWikipediaBtn.addEventListener('click', () => this.searchWikipedia());
        this.wikipediaSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchWikipedia();
        });
        
        this.closeWikipediaBtn.addEventListener('click', () => this.closeWikipedia());
        this.closeWikipediaX.addEventListener('click', () => this.closeWikipedia());
        
        // Close on background click
        this.wikipediaContainer.addEventListener('click', (e) => {
            if (e.target === this.wikipediaContainer) {
                this.closeWikipedia();
            }
        });
        
        // Add search color effect - only for normal AI
        this.userInput.addEventListener('input', (e) => {
            const value = e.target.value.toLowerCase().trim();
            if (this.currentAI === 'normal' && value.startsWith('search')) {
                this.userInput.style.color = '#2196f3';
                this.userInput.style.background = 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)';
                this.userInput.style.borderColor = '#2196f3';
            } else if (this.currentAI === 'calculator' && /[0-9+\-*/().\s]/.test(value)) {
                this.userInput.style.color = '#28a745';
                this.userInput.style.background = 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)';
                this.userInput.style.borderColor = '#28a745';
            } else if (this.currentAI === 'food' && value.includes('what should')) {
                this.userInput.style.color = '#fd7e14';
                this.userInput.style.background = 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)';
                this.userInput.style.borderColor = '#fd7e14';
            } else {
                this.userInput.style.color = '#333';
                this.userInput.style.background = '#f8f9fa';
                this.userInput.style.borderColor = '#e9ecef';
            }
        });
    }
    
    sendMessage() {
        const message = this.userInput.value.trim();
        if (!message) return;
        
        this.addMessage(message, 'user');
        this.userInput.value = '';
        
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.removeTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
        }, 1000 + Math.random() * 1000);
    }
    
    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check if message starts with 'search' - immediate search for any AI
        if (lowerMessage.startsWith('search')) {
            const searchTerm = this.extractSearchTerm(message, 'search');
            if (searchTerm) {
                this.showLoadingAndSearch(searchTerm);
                return;
            }
        }
        
        if (this.currentAI === 'calculator') {
            return this.handleCalculatorAI(message);
        } else if (this.currentAI === 'food') {
            return this.handleFoodAI(message);
        } else {
            return this.handleNormalAI(message);
        }
    }
    
    handleCalculatorAI(message) {
        // Remove letters and keep only math characters
        const cleanMessage = message.replace(/[^0-9+\-*/().\s]/g, '');
        
        if (cleanMessage.trim() === '') {
            return "Please enter a valid math equation! 🧮";
        }
        
        try {
            // Safe evaluation of math expression
            const result = Function('"use strict"; return (' + cleanMessage + ')')();
            return `🎯 ${cleanMessage} = ${result}`;
        } catch (error) {
            return "Oops! That doesn't look like a valid equation. Try something like '10 + 11 - 15' 📊";
        }
    }
    
    handleFoodAI(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('what should') || lowerMessage.includes('suggest') || lowerMessage.includes('recommend') || 
            lowerMessage.includes('what to') || lowerMessage.includes('food') || lowerMessage.includes('eat') ||
            lowerMessage.includes('try') || lowerMessage.includes('hungry')) {
            const foods = [
                "🍕 Try making a homemade pizza with fresh basil and mozzarella!",
                "🍜 How about a spicy ramen bowl with soft-boiled eggs?",
                "🥗 A fresh Mediterranean salad with feta cheese would be amazing!",
                "🍔 Why not try a gourmet burger with caramelized onions?",
                "🍣 Fresh sushi rolls with wasabi and soy sauce sound delicious!",
                "🌮 Tacos al pastor with pineapple and cilantro would be perfect!",
                "🍛 Chicken tikka masala with basmati rice is always a great choice!",
                "🥘 A hearty beef stew with vegetables sounds comforting!",
                "🍝 Homemade pasta with garlic bread - classic and delicious!",
                "🍛 Thai green curry with jasmine rice would be amazing!",
                "🥪 Greek gyros with tzatziki sauce and pita bread!",
                "🍖 Korean BBQ with kimchi and rice - flavorful and fun!",
                "🐟 Fish and chips with mushy peas - a British classic!",
                "🥘 Vegetarian chili with cornbread - hearty and healthy!",
                "🍱 French croissants with coffee - perfect for breakfast!",
                "🥙 Shawarma with garlic sauce - Middle Eastern delight!",
                "🍜 Pho soup with fresh herbs - Vietnamese comfort food!",
                "🍛 Butter chicken with naan bread - Indian favorite!",
                "🥪 Falafel with hummus - Mediterranean goodness!",
                "🍖 BBQ ribs with coleslaw - American classic!"
            ];
            return foods[Math.floor(Math.random() * foods.length)];
        }
        
        return "Ask me 'what should I eat today?' or 'suggest some food' and I'll give you delicious recommendations! 🍽️";
    }
    
    handleNormalAI(message) {
        const lowerMessage = message.toLowerCase();
        
        // Help command
        if (lowerMessage.includes('help') || lowerMessage.includes('commands')) {
            return `Here are some things I can help you with:
📚 Say "search [anything]" to search Wikipedia
😄 Say "tell me a joke" for a laugh
🕐 Ask "what's the time" for current time
🎲 Say "tell me a fact" for random facts
💬 Just chat with me about anything!`;
        }
        
        // Time command
        if (lowerMessage.includes('time') || lowerMessage.includes('date')) {
            const now = new Date();
            return `🕐 The current time is ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}`;
        }
        
        // Joke command
        if (lowerMessage.includes('joke') || lowerMessage.includes('funny')) {
            return this.jokes[Math.floor(Math.random() * this.jokes.length)];
        }
        
        // Fact command
        if (lowerMessage.includes('fact') || lowerMessage.includes('interesting')) {
            return this.facts[Math.floor(Math.random() * this.facts.length)];
        }
        
        // Default response
        return this.getDefaultResponse();
    }
    
    showLoadingAndSearch(searchTerm) {
        // Show loading message
        this.addMessage('🔍 Searching...', 'bot');
        
        // Add loading animation
        const loadingMsg = this.chatBody.lastElementChild;
        loadingMsg.classList.add('typing');
        
        // Open Wikipedia after delay
        setTimeout(() => {
            this.openWikipedia(searchTerm);
            // Update loading message
            loadingMsg.innerHTML = `<p>📚 Found Wikipedia results for "${searchTerm}"!</p>`;
            loadingMsg.classList.remove('typing');
        }, 1500);
    }
    
    getDefaultResponse() {
        const defaultResponses = [
            "That's interesting! Tell me more about that.",
            "I see! What else would you like to know?",
            "Hmm, let me think about that... That's a great question!",
            "I understand! How can I help you further?",
            "That's cool! Is there anything specific you'd like to do?",
            "I'm here to help! Try asking me to search Wikipedia for something or tell you a joke!",
            "Interesting perspective! What's on your mind?"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `msg ${sender}`;
        
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        messageDiv.appendChild(paragraph);
        
        this.chatBody.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'msg bot typing';
        typingDiv.id = 'typing-indicator';
        
        const paragraph = document.createElement('p');
        paragraph.innerHTML = '<span class="loading-dots"><span></span><span></span><span></span></span>';
        typingDiv.appendChild(paragraph);
        
        this.chatBody.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    scrollToBottom() {
        this.chatBody.scrollTop = this.chatBody.scrollHeight;
    }
    
    clearChat() {
        this.chatBody.innerHTML = `
            <div class="msg bot">
                <p>Hello! I'm your AI assistant. Try asking me to "search wikipedia cats", "tell me a joke", "what's the time", or "help" for more options!</p>
            </div>
        `;
    }
    
    extractSearchTerm(message, pattern) {
        if (pattern === 'search') {
            return message.replace(/^search\s+/i, '').trim();
        }
        return message.replace(/search\s+(.+?)\s+in\s+wikipedia/i, '$1').trim();
    }
    
    openWikipedia(searchTerm) {
        const encodedSearch = encodeURIComponent(searchTerm);
        this.wikipediaIframe.src = `https://en.wikipedia.org/wiki/Special:Search?search=${encodedSearch}`;
        this.wikipediaContainer.style.display = 'flex';
    }
    
    closeWikipedia() {
        this.wikipediaContainer.style.display = 'none';
        this.wikipediaIframe.src = '';
        this.wikipediaSearch.value = '';
    }
    
    showAISelection() {
        this.aiSelection.style.display = 'block';
        this.chatContainer.style.display = 'none';
        
        // Remove background image when going back to selection
        const existingBg = document.querySelector('.ai-bg');
        if (existingBg) {
            existingBg.classList.add('fade-out');
            setTimeout(() => existingBg.remove(), 500);
        }
    }
    
    switchAI(aiType) {
        this.currentAI = aiType;
        
        // Remove existing background
        const existingBg = document.querySelector('.ai-bg');
        if (existingBg) {
            existingBg.classList.add('fade-out');
            setTimeout(() => existingBg.remove(), 500);
        }
        
        // Hide selection and show chat
        this.aiSelection.style.display = 'none';
        this.chatContainer.style.display = 'flex';
        
        // Add new background image
        setTimeout(() => {
            const bgDiv = document.createElement('div');
            bgDiv.className = `ai-bg ai-bg-${aiType}`;
            
            // Use absolute path for Vercel compatibility
            const imagePath = `/images/${aiType}.png`;
            bgDiv.style.background = `url('${imagePath}') no-repeat right center`;
            bgDiv.style.backgroundSize = 'cover';
            
            document.body.appendChild(bgDiv);
        }, 600);
        
        // Update UI based on AI type
        switch(aiType) {
            case 'calculator':
                this.aiTitle.innerHTML = '<i class="fas fa-calculator me-2"></i>Calculator AI';
                this.clearChat();
                this.addMessage('🧮 Calculator AI ready! Enter any math equation like "10 + 11 - 15"', 'bot');
                break;
            case 'food':
                this.aiTitle.innerHTML = '<i class="fas fa-utensils me-2"></i>Food AI';
                this.clearChat();
                this.addMessage('🍽️ Food AI ready! Ask me "what should I try today?" for delicious suggestions!', 'bot');
                break;
            case 'normal':
            default:
                this.aiTitle.innerHTML = '<i class="fas fa-search me-2"></i>Master Search AI';
                this.clearChat();
                this.addMessage('🔍 Master Search AI ready! Try "search wikipedia cats" or ask me anything!', 'bot');
                break;
        }
        
        // Add transition animation
        this.chatBody.style.opacity = '0';
        setTimeout(() => {
            this.chatBody.style.opacity = '1';
        }, 300);
    }
    
    searchWikipedia() {
        const query = this.wikipediaSearch.value.trim();
        if (!query) return;
        
        const encodedSearch = encodeURIComponent(query);
        this.wikipediaIframe.src = `https://en.wikipedia.org/wiki/Special:Search?search=${encodedSearch}`;
        this.wikipediaSearch.value = '';
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const chatBot = new ChatBot();
    
    // Add entrance animation
    setTimeout(() => {
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
            chatContainer.style.opacity = '1';
            chatContainer.style.transform = 'translateY(0)';
        }
    }, 100);
});


