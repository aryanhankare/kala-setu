/**
 * /api/analyze.js — Vercel Serverless Function
 * 
 * Receives a product image (base64) and optional artisan description.
 * Calls Google Gemini Pro Vision to analyze the product.
 * Returns structured catalogue JSON.
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

  const { image, description } = req.body || {};

  if (!image) {
    return res.status(400).json({ error: 'No image provided' });
  }

  // Validate base64 image format
  const base64Match = image.match(/^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/);
  if (!base64Match) {
    return res.status(400).json({ error: 'Invalid image format. Supported: JPG, PNG, WEBP' });
  }

  const mimeType = base64Match[1] === 'jpg' ? 'image/jpeg' : `image/${base64Match[1]}`;
  const base64Data = base64Match[2];

  // Check API key
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    console.error('AI_API_KEY environment variable is not set');
    return res.status(500).json({
      error: 'AI service is not configured. Please contact support.',
      code: 'MISSING_API_KEY'
    });
  }

  // Build the prompt for Gemini
  const systemPrompt = `You are KalaSetu Smart Cataloguing AI. You help marginalized Indian artisans create accurate digital product listings from photographs and natural descriptions.

Analyze the actual product shown in the image. Do not invent details that cannot reasonably be inferred from the image and description provided.

Return a JSON object with exactly these fields:
{
  "identified": "Short name of what the AI identified (e.g. 'Handwoven Cotton Saree')",
  "category": "One of: Pottery, Textiles, Jewellery, Woodwork, Bamboo, Metalwork, Embroidery, Other",
  "subcategory": "Specific product type within category (e.g. 'Sarees', 'Necklaces', 'Bowls')",
  "title": "A professional, appealing product title for an online marketplace",
  "description": "A concise 2-3 sentence product description suitable for an e-commerce listing. Highlight craftsmanship, materials, and use.",
  "materials": ["Material 1", "Material 2", "Material 3"],
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"],
  "minPrice": 800,
  "maxPrice": 1500
}

Price guidelines (Indian Rupees ₹):
- This is an INDICATIVE suggested range for handmade artisan products.
- Consider: material cost, estimated craft complexity, comparable handmade products on Indian e-commerce.
- Ranges should be realistic for Indian handmade markets (typically ₹300–₹15,000).
- If you cannot determine price from the image, use a conservative middle estimate.

Return ONLY the JSON object. No markdown, no explanation, no extra text.`;

  const userContent = [
    {
      inlineData: {
        mimeType: mimeType,
        data: base64Data
      }
    },
    {
      text: description
        ? `Artisan's description: "${description}"\n\nAnalyze this product image and create a catalogue listing.`
        : 'Analyze this product image and create a catalogue listing. Use the image to determine what the product is.'
    }
  ];

  try {
    // Call Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: userContent }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return res.status(502).json({
        error: 'AI analysis service is temporarily unavailable. Please try again.',
        code: 'AI_SERVICE_ERROR'
      });
    }

    const data = await response.json();

    // Extract text from Gemini response
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error('Empty response from Gemini:', JSON.stringify(data));
      return res.status(502).json({
        error: 'AI could not analyze this image. Please try a different photo.',
        code: 'EMPTY_AI_RESPONSE'
      });
    }

    // Parse JSON from response (handle potential markdown wrapping)
    let result;
    try {
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', text);
      return res.status(502).json({
        error: 'AI response format error. Please try again.',
        code: 'PARSE_ERROR'
      });
    }

    // Validate required fields and apply defaults
    const catalogue = {
      identified: result.identified || 'Handcrafted Artisan Product',
      category: result.category || 'Other',
      subcategory: result.subcategory || 'General',
      title: result.title || 'Handcrafted Artisan Product',
      description: result.description || 'A beautiful handmade product crafted with care using traditional techniques.',
      materials: Array.isArray(result.materials) && result.materials.length > 0
        ? result.materials.slice(0, 5)
        : ['Handcrafted'],
      tags: Array.isArray(result.tags) && result.tags.length > 0
        ? result.tags.slice(0, 7)
        : ['Handmade', 'Traditional', 'India'],
      minPrice: typeof result.minPrice === 'number' && result.minPrice > 0
        ? Math.round(result.minPrice)
        : 800,
      maxPrice: typeof result.maxPrice === 'number' && result.maxPrice > result.minPrice
        ? Math.round(result.maxPrice)
        : 1500
    };

    return res.status(200).json(catalogue);

  } catch (error) {
    console.error('Analysis failed:', error.message);
    return res.status(500).json({
      error: 'Something went wrong. Please try again or enter details manually.',
      code: 'INTERNAL_ERROR'
    });
  }
};
