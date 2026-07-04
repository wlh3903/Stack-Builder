import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to automatically parse incoming JSON payloads
app.use(express.json());

// A simple test route
app.get('/', (req, res) => {
    res.json({ message: "Express backend initialized successfully!" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running smoothly on http://localhost:${PORT}`);
});
