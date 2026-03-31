import { filterMessage } from '../services/filterService.js';

describe('FilterService', () => {
    test('should flag inappropriate content', () => {
        const result = filterMessage('this is some sexual stuff');
        expect(result.isFlagged).toBe(true);
        expect(result.reply).toContain("keep our space warm and respectful");
    });

    test('should not flag clean content', () => {
        const result = filterMessage('how are you today?');
        expect(result.isFlagged).toBe(false);
    });
});
