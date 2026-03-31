import { determineIntent } from '../services/intentService.js';

describe('IntentService', () => {
    test('should identify greeting intent', () => {
        const result = determineIntent('hello');
        expect(result.intent).toBe('greeting');
    });

    test('should identify joke intent', () => {
        const result = determineIntent('tell me a joke');
        expect(result.intent).toBe('joke');
    });

    test('should identify knowledge_answer for Artificial Intelligence', () => {
        const result = determineIntent('what is artificial intelligence?');
        expect(result.intent).toBe('knowledge_answer');
        expect(result.source).toBeDefined();
    });

    test('should fallback for unknown queries', () => {
        const result = determineIntent('xyzabc123');
        expect(result.intent).toBe('fallback');
    });
});
