import express from 'express';
import {
    createString,
    getString,
    filterByNaturalLanguage,
    removeString,
    fetchAllStrings
} from '../controllers/stringsController.js';

const stringsRouter = express.Router();

// ✅ GET /strings/filter-by-natural-language
stringsRouter.get('/filter-by-natural-language', filterByNaturalLanguage);

// ✅ GET /strings - All strings + query filters
stringsRouter.get('/', fetchAllStrings);

// ✅ POST /strings
stringsRouter.post('/', createString);

// ✅ GET /strings/:string_value
stringsRouter.get('/:string', getString);

// ✅ DELETE /strings/:string_value
stringsRouter.delete('/:string', removeString);

export default stringsRouter;
