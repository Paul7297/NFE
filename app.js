const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve all files in the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Start the server on '0.0.0.0' to allow network access
app.listen(PORT, '0.0.0.0', () => {
    console.log('Server is running!');
    console.log(`Access on PC: http://localhost:${PORT}`);
    
    // Replace <YOUR_IP_ADDRESS> with your computer's local IP (e.g., 192.168.1.5)
    console.log(`Access on Mobile: http://192.168.1.33:${PORT}`);
});
