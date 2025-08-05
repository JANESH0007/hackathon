// server/server.js

import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// --- THIS IS THE FIX ---
// This is the correct way to import a CommonJS module in an ES Module file
import SerpApi from 'google-search-results-nodejs';
const { getJson } = SerpApi;
// --- END OF FIX ---

const app = express();
app.use(cors());

app.get('/api/location-details', (req, res) => {
    const query = req.query.q;
    const apiKey = process.env.SERPAPI_API_KEY;

    if (!query) {
        return res.status(400).json({ error: 'Search query (q) is required.' });
    }

    const params = {
        q: query,
        api_key: apiKey,
        engine: "google",
        gl: "in",
        hl: "en",
    };

    getJson(params, (json) => {
        if (json.organic_results && json.organic_results.length > 0) {
            res.json({ snippet: json.organic_results[0].snippet });
        } else {
            res.json({ snippet: 'No details found for this location.' });
        }
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});