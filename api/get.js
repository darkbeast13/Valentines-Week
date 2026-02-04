/**
 * GET /api/get?id=ID
 * Fetch a greeting by its unique ID
 * 
 * Query: id (required)
 * Response: { sender: string, receiver: string, message: string, created_at: string }
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    // Only allow GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { id } = req.query;

        // Validate ID
        if (!id) {
            return res.status(400).json({
                error: 'Missing ID',
                message: 'Greeting ID is required'
            });
        }

        // Sanitize ID (alphanumeric and dashes only)
        if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
            return res.status(400).json({
                error: 'Invalid ID',
                message: 'Greeting ID contains invalid characters'
            });
        }

        // Fetch from database
        const { data, error: dbError } = await supabase
            .from('greetings')
            .select('sender, receiver, message, day_index, created_at')
            .eq('id', id)
            .single();

        if (dbError) {
            if (dbError.code === 'PGRST116') {
                // No rows returned
                return res.status(404).json({
                    error: 'Not found',
                    message: 'Greeting not found'
                });
            }
            console.error('Database error:', dbError);
            return res.status(500).json({
                error: 'Database error',
                message: 'Failed to fetch greeting'
            });
        }

        if (!data) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Greeting not found'
            });
        }

        // Set cache headers for performance
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

        return res.status(200).json(data);

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            error: 'Server error',
            message: 'An unexpected error occurred'
        });
    }
}
