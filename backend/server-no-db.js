const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3333;

// CORS configuration for React frontend
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    credentials: true
}));

app.use(express.json());

// Serve static files (legacy HTML pages)
app.use(express.static(path.join(__dirname, 'public')));

// Basic API routes for testing
app.get('/api', (req, res) => {
    res.json({ message: 'API is working!', status: 'ok' });
});

app.get('/api/check_session', (req, res) => {
    console.log('Received check_session request');
    res.json({ 
        success: false, 
        message: 'Not authenticated (no DB connection)',
        data: { user: null }
    });
});

app.post('/api/login', (req, res) => {
    console.log('Login attempt:', req.body);
    res.json({
        success: false,
        message: 'Database not connected - this is a test server'
    });
});

app.post('/api/register', (req, res) => {
    console.log('Register attempt:', req.body);
    res.json({
        success: false,
        message: 'Database not connected - this is a test server'
    });
});

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(port, () => {
    console.log(`🚀 Test server running on http://localhost:${port}`);
    console.log(`📡 API available at http://localhost:${port}/api`);
    console.log(`🌐 Legacy HTML pages served from /public`);
});