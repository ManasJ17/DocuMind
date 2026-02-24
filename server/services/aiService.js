const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// Validate API key on startup
const apiKey = process.env.GROK_API_KEY;
if (!apiKey || apiKey === 'REPLACE_WITH_YOUR_GROK_API_KEY') {
    console.warn('⚠️ GROK_API_KEY not configured! AI features will not work.');
} else {
    console.log('✅ Groq API key loaded');
}

/**
 * Core function – calls Groq chat completions (OpenAI-compatible format)
 */
async function callGroq(prompt) {
    const key = process.env.GROK_API_KEY;

    if (!key || key === 'REPLACE_WITH_YOUR_GROK_API_KEY') {
        const err = new Error('Groq API key not configured. Please add GROK_API_KEY to .env');
        err.statusCode = 503;
        throw err;
    }

    try {
        const response = await axios.post(
            GROQ_API_URL,
            {
                model: GROQ_MODEL,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 4096,
            },
            {
                headers: {
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const text = response.data?.choices?.[0]?.message?.content;
        if (!text) {
            const err = new Error('Empty response from Groq API');
            err.statusCode = 502;
            throw err;
        }
        return text;
    } catch (error) {
        // Re-throw our own errors
        if (error.statusCode) throw error;

        // Axios error from Groq API
        if (error.response) {
            const status = error.response.status;
            const errMessage =
                error.response.data?.error?.message || 'Unknown Groq API error';
            console.error(`❌ Groq API error (${status}):`, errMessage);

            if (status === 400) {
                const err = new Error(`Groq API bad request: ${errMessage}`);
                err.statusCode = 400;
                throw err;
            }
            if (status === 401 || status === 403) {
                const err = new Error(
                    'Invalid Groq API key. Please check your GROK_API_KEY in .env'
                );
                err.statusCode = 401;
                throw err;
            }
            if (status === 429) {
                const err = new Error(
                    'Groq API rate limit exceeded. Please try again later.'
                );
                err.statusCode = 429;
                throw err;
            }

            const err = new Error(`Groq API error: ${errMessage}`);
            err.statusCode = status || 502;
            throw err;
        }

        // Network error
        console.error('❌ Groq API network error:', error.message);
        const err = new Error(
            'Failed to connect to Groq API. Check your internet connection.'
        );
        err.statusCode = 503;
        throw err;
    }
}

function truncateText(text, maxChars = 30000) {
    return text.length > maxChars
        ? text.substring(0, maxChars) + '...[truncated]'
        : text;
}

// ─── Exported AI feature functions ──────────────────────────────────────────

exports.generateSummary = async (text) => {
    const prompt = `You are an academic summarization assistant.

Summarize the following content into a clean, well-structured paragraph.

Strict formatting rules:
- Do NOT use markdown.
- Use headings (in plain text, e.g., ALL CAPS).
- Use bullet points (using simple dashes -).
- Do NOT use asterisks (*), hashes (#), or special formatting.
- Divide the response into sections.
- Add titles like OVERVIEW or KEY POINTS.
- Write in plain text only.
- Use formal academic tone.
- Keep the summary concise but complete.
- Do not invent information. 
- Do not exaggerate.
- Avoid repetition.
- Ensure logical flow from beginning to conclusion.

Output format:
Return only one or two well-structured paragraphs with clear section titles in plain text.

Content to summarize:
"""
${truncateText(text)}
"""`;

    return await callGroq(prompt);
};

exports.explainConcept = async (text, question) => {
    const prompt = `You are a helpful AI learning assistant. Based on the following document content, answer the student's question clearly and thoroughly.

Document content:
${truncateText(text)}

Student's question: ${question}

Provide a clear, detailed answer. If the answer isn't directly in the document, say so but try to provide relevant context.`;

    return await callGroq(prompt);
};

exports.generateFlashcards = async (text, count = 10) => {
    const prompt = `You are an expert educator. Generate exactly ${count} flashcards from the following document content for study purposes.

Document content:
${truncateText(text)}

Return ONLY a valid JSON array of objects with "question" and "answer" fields. No markdown, no explanation, just the JSON array.
Example format: [{"question": "What is X?", "answer": "X is..."}]`;

    const result = await callGroq(prompt);

    try {
        const jsonMatch = result.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return JSON.parse(result);
    } catch (e) {
        console.error('❌ Failed to parse flashcards JSON:', result.substring(0, 200));
        const err = new Error(
            'Failed to parse flashcards from AI response. Please try again.'
        );
        err.statusCode = 502;
        throw err;
    }
};

exports.generateQuiz = async (text, count = 5) => {
    const prompt = `You are an expert educator. Generate exactly ${count} multiple-choice quiz questions from the following document content.

Document content:
${truncateText(text)}

Return ONLY a valid JSON array of objects with these exact fields:
- "question": string (the question)
- "options": string array with exactly 4 options
- "correctAnswer": number (0-3 index of correct option)
- "explanation": string (brief explanation of why the answer is correct)

No markdown, no explanation, just the JSON array.`;

    const result = await callGroq(prompt);

    try {
        const jsonMatch = result.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return JSON.parse(result);
    } catch (e) {
        console.error('❌ Failed to parse quiz JSON:', result.substring(0, 200));
        const err = new Error(
            'Failed to parse quiz from AI response. Please try again.'
        );
        err.statusCode = 502;
        throw err;
    }
};
