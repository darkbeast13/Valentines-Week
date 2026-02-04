import express from 'express';
import { nanoid } from 'nanoid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// In-memory "database" for demo purposes
const db = new Map();

// POST /api/create - Mock endpoint
app.post('/api/create', (req, res) => {
    const { sender, receiver, day_index, subtitle, quote, day_message, memories } = req.body;

    if (!sender || !receiver) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = nanoid(8);

    // Parse memories (string with newlines -> array)
    let memoriesArray = [];
    if (memories && typeof memories === 'string') {
        memoriesArray = memories.split('\n').filter(line => line.trim() !== '');
    }

    // Store in memory
    db.set(id, {
        sender,
        receiver,
        day_index: parseInt(day_index || 0, 10),
        subtitle: subtitle || '',
        quote: quote || '',
        day_message: day_message || '',
        memories: memoriesArray,
        created_at: new Date().toISOString()
    });

    console.log(`[DEMO] Created greeting ${id} for ${receiver} from ${sender}`);

    // Return success
    const protocol = req.protocol;
    const host = req.get('host');
    const url = `${protocol}://${host}/?id=${id}`;

    res.status(201).json({ success: true, id, url });
});

// GET /api/get - Mock endpoint
app.get('/api/get', (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Missing ID' });
    }

    const greeting = db.get(id);

    if (!greeting) {
        return res.status(404).json({ error: 'Not found' });
    }

    res.json(greeting);
});

// Start server
app.listen(PORT, () => {
    console.log(`
============================================================
💞 Valentine's Demo Server Running!
============================================================

Local URL: http://localhost:${PORT}

1. Open http://localhost:${PORT} to create a greeting
2. Submit the form to generate a link
3. Open the generated link to see the personalized version

Data is stored in-memory (will reset when server stops).
============================================================
`);
});
