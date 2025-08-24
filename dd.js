// example-app/index.js

// --- 1. INITIALIZE DEVGUARDIAN ---
// This is the most important step. It MUST be the first thing you require and run.
const DevGuardian = require('@devguardian/sdk-node');

DevGuardian.init(
    apiKey= 'my_api_keuy',
    uploadUrl= ''
);

// --- 2. SETUP A BASIC EXPRESS SERVER ---
const express = require('express');
const app = express();
const PORT = 3001;

console.log('✅ DevGuardian SDK has been initialized.');

// --- 3. CREATE BUGGY ENDPOINTS ---

// Endpoint to test an Uncaught Exception (a hard crash)
app.get('/crash', (req, res) => {
    console.log('Received request for /crash. This will cause a server crash.');
    setTimeout(() => {
        // This is a classic TypeError
        const user = null;
        console.log(user.name);
    }, 100);
    // This response will likely not be sent because the server will crash first.
    res.send('Crashing...');
});

// Endpoint to test an Unhandled Promise Rejection (a silent but deadly error)
app.get('/async-crash', (req, res) => {
    console.log('Received request for /async-crash. This will cause an unhandled promise rejection.');

    const someAsyncFunction = async () => {
        throw new Error("Something went wrong inside a promise!");
    };

    // We intentionally do not 'await' or add a '.catch()' here.
