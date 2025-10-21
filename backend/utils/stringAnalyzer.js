import { createHash } from 'crypto';

export const analyzeString = (str) => {
    const length = str.length;
    const is_palindrome = checkPalindrome(str);
    const unique_characters = countUniqueCharacters(str);
    const word_count = countWords(str);
    const sha256_hash = calculateSHA256(str);
    const character_frequency_map = buildCharacterFrequencyMap(str);

    return {
        length,
        is_palindrome,
        unique_characters,
        word_count,
        sha256_hash,
        character_frequency_map
    };
};

export const calculateSHA256 = (str) => {
    return createHash('sha256').update(str).digest('hex');
};

const checkPalindrome = (str) => {
    const cleanedStr = str.replace(/\s+/g, '').toLowerCase();
    return cleanedStr === cleanedStr.split('').reverse().join('');
};

const countUniqueCharacters = (str) => {
    const uniqueChars = new Set(str.toLowerCase().replace(/\s+/g, ''));
    return uniqueChars.size;
};

const countWords = (str) => {
    return str.trim() ? str.trim().split(/\s+/).length : 0;
};

const buildCharacterFrequencyMap = (str) => {
    const frequencyMap = {};
    const cleanedStr = str.toLowerCase();

    for (const char of cleanedStr) {
        if (char !== ' ') {
            frequencyMap[char] = (frequencyMap[char] || 0) + 1;
        }
    }

    return frequencyMap;
};

export const parseNaturalLanguageQuery = (query) => {
    const lowerQuery = query.toLowerCase();
    const filters = {};

    // Check for palindrome-related terms
    if (lowerQuery.includes('palindrom')) {
        filters.is_palindrome = true;
    }

    // Check for length-related terms
    const lengthMatch = lowerQuery.match(/(?:longer than|greater than|more than|at least)\s+(\d+)/);
    if (lengthMatch) {
        filters.min_length = parseInt(lengthMatch[1]) + 1;
    }

    const shorterMatch = lowerQuery.match(/(?:shorter than|less than|fewer than)\s+(\d+)/);
    if (shorterMatch) {
        filters.max_length = parseInt(shorterMatch[1]) - 1;
    }

    // Check for word count
    const singleWordMatch = lowerQuery.match(/(?:single|one)\s+word/);
    if (singleWordMatch) {
        filters.word_count = 1;
    }

    const wordCountMatch = lowerQuery.match(/(\d+)\s+word/);
    if (wordCountMatch) {
        filters.word_count = parseInt(wordCountMatch[1]);
    }

    // Check for character containment
    const charMatch = lowerQuery.match(/(?:contain|has|with).*?(?:letter|character)\s+['"]?([a-z])['"]?/);
    if (charMatch) {
        filters.contains_character = charMatch[1];
    }

    // Alternative pattern for character containment
    const charMatch2 = lowerQuery.match(/(?:contain|has|with)\s+['"]?([a-z])['"]?/);
    if (charMatch2 && !filters.contains_character) {
        filters.contains_character = charMatch2[1];
    }

    return Object.keys(filters).length > 0 ? filters : null;
};