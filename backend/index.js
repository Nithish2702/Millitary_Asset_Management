require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const logger = require('./middleware/logger');

const app = express();

// CORS configuration - Allow Vercel deployments and localhost
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        // Allow localhost for development
        if (origin.includes('localhost')) return callback(null, true);
        
        // Allow all Vercel deployments
        if (origin.includes('vercel.app')) return callback(null, true);
        
        // Allow specific production domain if you have one
        if (origin === process.env.FRONTEND_URL) return callback(null, true);
        
        // Reject other origins
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Disable caching for API responses
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

app.use(logger);

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/purchases', require('./routes/purchases'));
app.use('/api/transfers', require('./routes/transfers'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/assets', require('./routes/assets'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date() });
});

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Military Asset Management API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            assets: '/api/assets',
            purchases: '/api/purchases',
            transfers: '/api/transfers',
            assignments: '/api/assignments'
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
