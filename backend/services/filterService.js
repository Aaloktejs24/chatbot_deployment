const BAD_WORDS = [
    'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'pussy', 'porn', 'sex', 'sexual', 'naked', 'explicit'
];

export const filterMessage = (message) => {
    const text = message.toLowerCase();
    const isFlagged = BAD_WORDS.some(word => {
        // Use inclusive matching for some words, or word boundaries for others
        if (word === 'sex') {
             return text.includes('sex'); // matches 'sexual', 'sexy', etc.
        }
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        return regex.test(text);
    });

    if (isFlagged) {
        return {
            isFlagged: true,
            reply: "I'd really prefer to keep our space warm and respectful. Could we please talk about something else? I'm here for you!"
        };
    }

    return { isFlagged: false };
};
