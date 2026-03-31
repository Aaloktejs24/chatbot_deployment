import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const intentsPath = path.join(__dirname, '../data/intents.json');
const knowledgePath = path.join(__dirname, '../data/knowledge.json');

// Basic tokenization and stop word removal using built in basic functions
const tokenize = (text) => {
    return text.toLowerCase()
        .replace(/[^\w\s]|_/g, "")
        .replace(/\s+/g, " ")
        .split(' ');
};

export const determineIntent = (message, context) => {
    const intentsData = JSON.parse(fs.readFileSync(intentsPath, 'utf8'));
    const knowledgeData = JSON.parse(fs.readFileSync(knowledgePath, 'utf8'));
    
    console.log(`[IntentService] Determining intent for: "${message}"`);
    const tokens = tokenize(message);
    const textLower = message.toLowerCase().trim();

    // 0. Handle 'how are you' vs 'who are you' specifically to avoid token confusion
    if (textLower === 'how are you' || textLower === 'how are you?') {
        return { intent: 'greeting', score: 1 };
    }

    // 1. Direct Knowledge matching (Q/A simple retrieval)
    let bestMatchKey = null;
    let highestCommonTokens = 0;
    
    // Evaluate knowledge keys based on keyword overlaps
    for (const key of Object.keys(knowledgeData)) {
        const lowerKey = key.toLowerCase().replace(/[?]/g, '').trim();
        
        // Exact match check for key
        if (textLower === lowerKey) {
            const item = knowledgeData[key];
            return { 
                intent: 'knowledge_answer', 
                score: 1, 
                data: typeof item === 'object' ? item.answer : item,
                source: typeof item === 'object' ? item.source : 'Internal Knowledge'
            };
        }

        const keyTokens = tokenize(key);
        const commonTokens = tokens.filter(x => keyTokens.includes(x));
        
        // Stricter subset matching for knowledge base
        if (commonTokens.length > highestCommonTokens && commonTokens.length >= 2) {
            // Avoid "how" vs "who" confusion
            if (lowerKey.includes('who') && textLower.includes('how')) continue;
            if (lowerKey.includes('how') && textLower.includes('who')) continue;

            highestCommonTokens = commonTokens.length;
            bestMatchKey = key;
        }
    }

    if (bestMatchKey && highestCommonTokens >= tokenize(bestMatchKey).length * 0.7) {
        const item = knowledgeData[bestMatchKey];
        return { 
            intent: 'knowledge_answer', 
            score: highestCommonTokens, 
            data: typeof item === 'object' ? item.answer : item,
            source: typeof item === 'object' ? item.source : 'Internal Knowledge'
        };
    }

    // 2. Intent matching with patterns
    let bestIntent = 'fallback';
    let maxMatchScore = 0;

    for (const intentObj of intentsData) {
        for (const pattern of intentObj.patterns) {
            const p = pattern.toLowerCase().trim();
            // Check for whole pattern match (case-insensitive)
            if (textLower === p) {
                return { intent: intentObj.intent, score: 1 };
            }

            const pTokens = tokenize(p);
            const isSubset = pTokens.every(pt => tokens.includes(pt));
            
            if (isSubset) {
                const matchScore = pTokens.length / tokens.length;
                if (matchScore > maxMatchScore) {
                    maxMatchScore = matchScore;
                    bestIntent = intentObj.intent;
                }
            }
        }
    }

    // Contextual handling: If user says 'yes', and previous intent was something requiring confirmation
    if (bestIntent === 'affirmation') {
        if (context && context.lastIntent === 'weather') {
            return { intent: 'weather_affirmation', score: 1 };
        }
    }

    if (maxMatchScore > 0) {
        return { intent: bestIntent, score: maxMatchScore };
    }

    return { intent: 'fallback', score: 0 };
};
