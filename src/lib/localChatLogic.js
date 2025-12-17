
/**
 * Local Chatbot Logic
 * 
 * This module handles the "brain" of the local chatbot.
 * It takes user input and a list of projects, and returns a response.
 */

// Helper to normalize text for matching
const normalize = (text) => text.toLowerCase().trim();

// Keywords for specific intents
const GREETING_KEYWORDS = ['hi', 'hello', 'hey', 'start', 'begin', 'help'];
const PRICE_KEYWORDS = ['price', 'cost', 'how much', 'expensive', 'cheap', 'budget', 'rate'];
const THANK_YOU_KEYWORDS = ['thanks', 'thank', 'thx'];

export const processUserMessage = (message, projects = []) => {
    const text = normalize(message);

    // 1. Handle Greetings
    if (GREETING_KEYWORDS.some(k => text === k || text.startsWith(k + ' '))) {
        return {
            text: "Hi! I'm Lumo. I can help you find the perfect project from our store. What are you looking for? You can ask about IoT, Robotics, AI, or specific technologies.",
            type: 'text'
        };
    }

    // 2. Handle Thank You
    if (THANK_YOU_KEYWORDS.some(k => text.includes(k))) {
        return {
            text: "You're welcome! Let me know if you need anything else.",
            type: 'text'
        };
    }

    // 3. Handle Price generic questions
    if (text === 'price' || text === 'cost' || (text.includes('much') && text.includes('project'))) {
        return {
            text: "Our projects typically range from ₹2,000 to ₹15,000 depending on complexity. If you ask about a specific project or category, I can give you a better estimate!",
            type: 'text'
        };
    }

    // 4. Project Search / Recommendation
    // Split user query into significant terms (remove stop words like 'how', 'to', 'find', 'me', etc.)
    const stopWords = [
        'how', 'to', 'find', 'show', 'me', 'a', 'an', 'the', 'system', 'project', 'projects',
        'can', 'you', 'u', 'explain', 'detail', 'details', 'about', 'what', 'is', 'i', 'want', 'need',
        'looking', 'for', 'tell', 'suggest', 'recommend'
    ];
    const terms = text.split(/\s+/).filter(w => !stopWords.includes(w) && w.length > 2);

    // Handle "robots" -> "robot" stemming manually for better matching
    const searchTerms = terms.map(t => {
        if (t === 'robots' || t === 'robotics') return 'robot';
        return t;
    });

    // Scoring system:
    // Title match: 5 points
    // Category match: 3 points
    // Description match: 1 point
    const scoredProjects = projects.map(p => {
        let score = 0;
        const title = normalize(p.title || '');
        const desc = normalize(p.description || '');
        const cat = normalize(p.category || '');
        const tags = (p.tags || []).map(t => normalize(t));

        searchTerms.forEach(term => {
            if (title.includes(term)) score += 5;
            else if (cat.includes(term)) score += 3;
            else if (desc.includes(term)) score += 1;
            else if (tags.some(t => t.includes(term))) score += 2;
        });

        return { project: p, score };
    });

    // Filter by score threshold (at least one significant match)
    const matches = scoredProjects
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.project);

    if (matches.length > 0) {
        // Sort by "relevance" (title match is better than desc match) - simplified here
        // Just take top 3
        const topMatches = matches.slice(0, 3);

        let responseText = `I found some projects that match "${message}": \n\n`;
        topMatches.forEach(p => {
            let priceDisplay = "Check details";
            // Handle different budget formats
            if (p.budget) {
                if (typeof p.budget === 'object') {
                    // Handle min/max range
                    if (p.budget.min && p.budget.max) {
                        priceDisplay = `₹${p.budget.min} - ₹${p.budget.max}`;
                    } else if (p.budget.min) {
                        priceDisplay = `From ₹${p.budget.min}`;
                    } else {
                        // try generic string conversion if structure is unknown
                        priceDisplay = JSON.stringify(p.budget).replace(/[{}"]/g, '');
                    }
                } else {
                    // String/Number
                    priceDisplay = `₹${p.budget}`;
                }
            } else if (p.price) {
                priceDisplay = `₹${p.price.toLocaleString()}`;
            }

            responseText += `• **${p.title}** (${p.category}) - ${priceDisplay}\n`;
        });

        responseText += `\nWould you like to see details for any of these?`;

        return {
            text: responseText,
            type: 'project_list',
            projects: topMatches
        };
    }

    // 5. Fallback
    return {
        text: "I'm not sure I found a project for that. We have categories like **IoT**, **Robotics**, **AI**, and **Embedded Systems**. Try searching for one of those!",
        type: 'text'
    };
};
