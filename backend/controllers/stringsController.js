import {
    analyzeString,
    parseNaturalLanguageQuery
} from '../utils/stringAnalyzer.js';
import {
    saveString,
    getStringByValue,
    getAllStrings,
    deleteString,
} from '../database/database.js';

export const createString = async (req, res, next) => {
    try {
        const { value } = req.body;

        // Validation
        if (value === undefined) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Missing "value" field in request body'
            });
        }

        if (typeof value !== 'string') {
            return res.status(422).json({
                error: 'Unprocessable Entity',
                message: 'Invalid data type for "value" (must be string)'
            });
        }

        // Check if string already exists
        const existingString = getStringByValue(value);
        if (existingString) {
            return res.status(409).json({
                error: 'Conflict',
                message: 'String already exists in the system'
            });
        }

        // Analyze string and save
        const properties = analyzeString(value);
        const stringData = {
            id: properties.sha256_hash,
            value,
            properties,
            created_at: new Date().toISOString()
        };

        saveString(stringData);

        res.status(201).json(stringData);
    } catch (error) {
        next(error);
    }
};

export const getString = (req, res, next) => {
    try {
        const { string } = req.params;

        // URL decode the string value
        const decodedValue = decodeURIComponent(string);
        const stringData = getStringByValue(decodedValue);

        if (!stringData) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'String does not exist in the system'
            });
        }

        res.status(200).json(stringData);
    } catch (error) {
        next(error);
    }
};

export const fetchAllStrings = (req, res, next) => {
    try {
        const {
            is_palindrome,
            min_length,
            max_length,
            word_count,
            contains_character
        } = req.query;

        // Parse query parameters
        const filters = {};

        if (is_palindrome !== undefined) {
            filters.is_palindrome = is_palindrome === 'true';
        }

        if (min_length !== undefined) {
            const minLen = parseInt(min_length);
            if (isNaN(minLen)) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'Invalid min_length parameter (must be integer)'
                });
            }
            filters.min_length = minLen;
        }

        if (max_length !== undefined) {
            const maxLen = parseInt(max_length);
            if (isNaN(maxLen)) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'Invalid max_length parameter (must be integer)'
                });
            }
            filters.max_length = maxLen;
        }

        if (word_count !== undefined) {
            const wordCount = parseInt(word_count);
            if (isNaN(wordCount)) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'Invalid word_count parameter (must be integer)'
                });
            }
            filters.word_count = wordCount;
        }

        if (contains_character !== undefined) {
            if (contains_character.length !== 1) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'Invalid contains_character parameter (must be single character)'
                });
            }
            filters.contains_character = contains_character;
        }

        const allStrings = getAllStrings();
        const filteredStrings = allStrings.filter(stringData => {
            const { properties } = stringData;

            if (filters.is_palindrome !== undefined &&
                properties.is_palindrome !== filters.is_palindrome) {
                return false;
            }

            if (filters.min_length !== undefined &&
                properties.length < filters.min_length) {
                return false;
            }

            if (filters.max_length !== undefined &&
                properties.length > filters.max_length) {
                return false;
            }

            if (filters.word_count !== undefined &&
                properties.word_count !== filters.word_count) {
                return false;
            }

            if (filters.contains_character !== undefined &&
                !properties.character_frequency_map[filters.contains_character.toLowerCase()]) {
                return false;
            }

            return true;
        });

        res.status(200).json({
            data: filteredStrings,
            count: filteredStrings.length,
            filters_applied: filters
        });
    } catch (error) {
        next(error);
    }
};

export const filterByNaturalLanguage = (req, res, next) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Missing "query" parameter'
            });
        }

        const parsedFilters = parseNaturalLanguageQuery(query);

        if (!parsedFilters) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Unable to parse natural language query'
            });
        }

        // Check for conflicting filters
        if (parsedFilters.min_length !== undefined &&
            parsedFilters.max_length !== undefined &&
            parsedFilters.min_length > parsedFilters.max_length) {
            return res.status(422).json({
                error: 'Unprocessable Entity',
                message: 'Conflicting filters: min_length cannot be greater than max_length'
            });
        }

        const allStrings = getAllStrings();
        const filteredStrings = allStrings.filter(stringData => {
            const { properties } = stringData;

            for (const [filter, value] of Object.entries(parsedFilters)) {
                switch (filter) {
                    case 'is_palindrome':
                        if (properties.is_palindrome !== value) return false;
                        break;
                    case 'min_length':
                        if (properties.length < value) return false;
                        break;
                    case 'max_length':
                        if (properties.length > value) return false;
                        break;
                    case 'word_count':
                        if (properties.word_count !== value) return false;
                        break;
                    case 'contains_character':
                        if (!properties.character_frequency_map[value.toLowerCase()]) return false;
                        break;
                }
            }
            return true;
        });

        res.status(200).json({
            data: filteredStrings,
            count: filteredStrings.length,
            interpreted_query: {
                original: query,
                parsed_filters: parsedFilters
            }
        });
    } catch (error) {
        next(error);
    }
};


export const removeString = (req, res, next) => {
    try {
        const { string } = req.params;
        const decodedValue = decodeURIComponent(string);

        const stringData = getStringByValue(decodedValue);

        if (!stringData) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'String does not exist in the system'
            });
        }

        deleteString(stringData.id);

        return res.status(204).send(); // ✅ Explicit return to stop further code
    } catch (error) {
        console.error('Error in removeString:', error);
        next(error);
    }
};
