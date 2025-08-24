// example-app/index.js

// --- 1. INITIALIZE DEVGUARDIAN ---
// This is the most important step. It MUST be the first thing you require and run.
const DevGuardian = require('@devguardian/sdk-node');

DevGuardian.init(
    apiKey= 'my_api_keuy',
    uploadUrl= 'https://c53puq7hy7.execute-api.af-south-1.amazonaws.com/prod/uploadLogs'
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
    someAsyncFunction();

    res.send('Triggered an unhandled promise rejection. The server may not crash immediately, but DevGuardian caught it.');
});

// Endpoint to test a Handled Exception (manually reporting a non-fatal error)
app.get('/handled-error', (req, res) => {
    console.log('Received request for /handled-error. This will be caught and reported manually.');
    try {
        // Simulate a function that might fail, e.g., parsing invalid JSON
        JSON.parse("{ 'invalid-json': }");
    } catch (err) {

});


// --- 4. START THE SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Example App is running on http://localhost:${PORT}`);
    console.log('Trigger errors by visiting the /crash, /async-crash, or /handled-error endpoints.');
});