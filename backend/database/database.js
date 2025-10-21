import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'strings.json');

// Initialize database file if it doesn't exist
const initializeDB = () => {
    if (!existsSync(DB_PATH)) {
        writeFileSync(DB_PATH, JSON.stringify({}, null, 2));
    }
};

// Read all strings from database
export const readDatabase = () => {
    initializeDB();
    try {
        const data = readFileSync(DB_PATH, 'utf8');

        const parsedData = JSON.parse(data);

        // Ensure we always return an object, even if empty
        const result = typeof parsedData === 'object' && !Array.isArray(parsedData)
            ? parsedData
            : {};

        return result;

    } catch (error) {
        console.error('Error reading database:', error);
        console.error('Error stack:', error.stack); // Debug
        return {}; // ← Return empty object on error
    }
};

// Write to database
const writeDatabase = (data) => {
    try {
        writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing to database:', error);
        throw error;
    }
};

// Save a new string
export const saveString = (stringData) => {
    const strings = readDatabase();
    strings[stringData.id] = stringData; // ← Use ID as key
    writeDatabase(strings);
    return stringData;
};

// Get string by value
export const getStringByValue = (value) => {
    const strings = readDatabase();

    // Search through all string objects to find one with matching value
    for (const id in strings) {
        if (strings[id].value === value) {
            return strings[id];
        }
    }

    return null; // Not found
};

// Get all strings
export const getAllStrings = () => {
    const strings = readDatabase();
    return Object.values(strings); // ← Convert to array for response
};

// Delete string by id
export const deleteString = (id) => {
    const strings = readDatabase();
    delete strings[id]; // ← Simple deletion
    writeDatabase(strings);
    return true;
};

// In your database.js, add this debug function
export const debugDatabase = () => {
    console.log('DB_PATH:', DB_PATH);
    console.log('File exists:', existsSync(DB_PATH));

    if (existsSync(DB_PATH)) {
        const fileContent = readFileSync(DB_PATH, 'utf8');
        console.log('File content:', fileContent);
        console.log('File size:', fileContent.length);
    }
};