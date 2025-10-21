import express from 'express';
import {
    createString,
    getString,
    filterByNaturalLanguage,
    removeString,
    fetchAllStrings
} from '../controllers/stringsController.js';

const stringsRouter = express.Router();

// GET /strings/filter-by-natural-language - Natural Language Filtering
stringsRouter.get('/filter-by-natural-language', filterByNaturalLanguage);

// POST /strings - Create/Analyze String
stringsRouter.post('/', createString);

// GET /strings/:string_value - Get Specific String
stringsRouter.get('/:string', getString);

// GET /strings - Get All Strings with Filtering
stringsRouter.get('/', fetchAllStrings);

// DELETE /strings/:string_value - Delete String
stringsRouter.delete('/:string', removeString);

export default stringsRouter;