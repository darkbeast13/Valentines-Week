/**
 * POST /api/create
 * Create a new greeting and return a shareable URL
 * 
 * Body: { sender: string, receiver: string, message: string }
 * Response: { success: true, id: string, url: string }
 */

import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Validation limits
const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 500;
const ID_LENGTH = 8;

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { sender, receiver, message } = req.body;

        // Validate required fields
        if (!sender || !receiver) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'Both sender and receiver names are required'
            });
        }

        // Validate lengths
        if (sender.length > MAX_NAME_LENGTH) {
            return res.status(400).json({
                error: 'Validation error',
                message: `Sender name must be ${MAX_NAME_LENGTH} characters or less`
            });
        }

        if (receiver.length > MAX_NAME_LENGTH) {
            return res.status(400).json({
                error: 'Validation error',
                message: `Receiver name must be ${MAX_NAME_LENGTH} characters or less`
            });
        }

        if (message && message.length > MAX_MESSAGE_LENGTH) {
            return res.status(400).json({
                error: 'Validation error',
                message: `Message must be ${MAX_MESSAGE_LENGTH} characters or less`
            });
        }

        // Generate unique ID
        const id = nanoid(ID_LENGTH);

        // Insert into database
        const { error: dbError } = await supabase
            .from('greetings')
            .insert({
                id,
                sender: sender.trim(),
                receiver: receiver.trim(),
                message: message ? message.trim() : '',
                day_index: (typeof req.body.day_index !== 'undefined') ? parseInt(req.body.day_index) : 0
            });

        if (dbError) {
            console.error('Database error:', dbError);
            return res.status(500).json({
                error: 'Database error',
                message: 'Failed to save greeting'
            });
        }

        // Build shareable URL
        const protocol = req.headers['x-forwarded-proto'] || 'https';
        const host = req.headers.host;
        const url = `${protocol}://${host}/?id=${id}`;

        return res.status(201).json({
            success: true,
            id,
            url
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            error: 'Server error',
            message: 'An unexpected error occurred'
        });
    }
}
