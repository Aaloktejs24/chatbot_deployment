import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const responsesPath = path.join(__dirname, '../data/responses.json');

export const getChatResponse = (intentResult, message, context) => {
    const responsesData = JSON.parse(fs.readFileSync(responsesPath, 'utf8'));

    if (intentResult.intent === 'knowledge_answer') {
        const sourceLine = intentResult.source ? `\n\n[Source: ${intentResult.source}]` : '';
        return { text: intentResult.data + sourceLine, intent: 'knowledge_answer' };
    }

    let intent = intentResult.intent;

    // Handle 'more' / 'tell me more' / 'why'
    if (intent === 'continuation') {
        const lastIntent = context?.lastIntent;
        if (lastIntent === 'refusal') {
             return { 
                 text: "I want our chat to stay a happy and safe space for everyone! That's why I avoid certain topics. Let's talk about something uplifting instead?", 
                 intent: 'refusal_explanation' 
             };
        }
        if (lastIntent && lastIntent !== 'fallback' && lastIntent !== 'continuation') {
            const followupIntent = `${lastIntent}_followup`;
            if (responsesData[followupIntent]) {
                intent = followupIntent;
            } else {
                intent = 'continuation_fallback';
            }
        } else {
            intent = 'continuation_fallback';
        }
    }

    // Handle 'yes' / 'no'
    if (intent === 'affirmation') {
        const lastIntent = context?.lastIntent;
        if (lastIntent && lastIntent.endsWith('_followup')) {
            // Re-trigger the base intent (e.g. joke_followup -> joke)
            intent = lastIntent.replace('_followup', '');
        }
    }

    // Special contextual intents
    if (intent === 'weather_affirmation') {
        return { text: "Awesome! Remember to stay hydrated out there.", intent: 'weather_affirmation' };
    }

    // Fetch array of responses for the detected intent
    const options = responsesData[intent] || responsesData['fallback'];

    // Select a random response from options to keep bot dynamic
    const randomIndex = Math.floor(Math.random() * options.length);
    return { text: options[randomIndex], intent: intent };
};
