/**
 * /api/chat.js — Vercel Serverless Function
 *
 * Receives a user message and optional context.
 * Calls Google Gemini to generate an AI chat response.
 * Returns the AI's reply text.
 *
 * Environment variable required: AI_API_KEY (Gemini API key)
 */

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, context } = req.body || {};

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'No message provided' });
  }

  // Check API key
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    console.error('AI_API_KEY environment variable is not set');
    return res.status(500).json({
      error: 'AI service is not configured. Please contact support.',
      code: 'MISSING_API_KEY'
    });
  }

  // Build the system prompt
  const systemPrompt = `You are KalaSetu Assistant, an AI helper for Indian artisans selling handmade products online.

Help artisans with:
- product pricing
- improving product descriptions
- product titles
- materials and tags
- photography advice
- understanding customer demand
- improving listings
- explaining orders and marketplace usage
- translating or simplifying listing text
- suggesting related products they could make

Your answers should be:
- practical
- simple
- concise
- easy for an artisan with limited technical knowledge to understand
- supportive but not overly verbose

When discussing prices, never pretend to know an exact market price unless actual data is available. Give a reasonable range and explain the factors affecting it.

Do not invent orders, sales numbers, customer information, or market statistics.

If the user asks something outside KalaSetu/artisan selling, politely say you are primarily designed to help with their craft business.`;

  // Build context string from artisan info
  let contextStr = '';
  if (context) {
    const parts = [];
    if (context.artisanName) parts.push(`Artisan name: ${context.artisanName}`);
    if (context.artisanCraft) parts.push(`Artisan's craft: ${context.artisanCraft}`);
    if (context.artisanLocation) parts.push(`Location: ${context.artisanLocation}`);
    if (context.productName) parts.push(`Current product: ${context.productName}`);
    if (context.productCategory) parts.push(`Product category: ${context.productCategory}`);
    if (context.productPrice) parts.push(`Product price: ₹${context.productPrice}`);
    if (context.productDescription) parts.push(`Product description: ${context.productDescription}`);
    if (context.productMaterials) parts.push(`Materials: ${context.productMaterials}`);
    if (context.productTags) parts.push(`Tags: ${context.productTags}`);
    if (parts.length > 0) {
      contextStr = '\n\nCurrent context:\n' + parts.join('\n');
    }
  }

  // Build the user message with context
  const fullUserMessage = contextStr
    ? `${message}\n\n[Context: ${contextStr.replace('\n\nCurrent context:\n', '')}]`
    : message;

  try {
    // Call Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullUserMessage }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          maxOutputTokens: 512,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return res.status(502).json({
        error: 'AI service is temporarily unavailable. Please try again.',
        code: 'AI_SERVICE_ERROR'
      });
    }

    const data = await response.json();

    // Extract text from Gemini response
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error('Empty response from Gemini:', JSON.stringify(data));
      return res.status(502).json({
        error: 'AI could not generate a response. Please try again.',
        code: 'EMPTY_AI_RESPONSE'
      });
    }

    return res.status(200).json({ reply: text });

  } catch (error) {
    console.error('Chat failed:', error.message);
    return res.status(500).json({
      error: 'Something went wrong. Please try again.',
      code: 'INTERNAL_ERROR'
    });
  }
};
