import express from 'express';
import errorHandler from './backend/middleware/errorHandler.js';
import stringsRouter from './backend/routes/stringsRoutes.js'


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/strings', stringsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: `The endpoint ${req.originalUrl} does not exist`
    });
});

app.listen(PORT, () => {
    console.log(`String Analyzer Service running on port ${PORT}`);
});