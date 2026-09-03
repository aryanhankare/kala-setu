/**
 * /api/analyze.js — Vercel Serverless Function
 * Receives a product image and optional artisan description.
 * Calls Gemini Vision and returns structured catalogue JSON.
 */

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};
  const image = typeof body.image === 'string' ? body.image : '';
  const description = typeof body.description === 'string' ? body.description.trim().slice(0, 2000) : '';

  if (!image) return res.status(400).json({ error: 'No image provided' });

  const base64Match = image.match(/^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/);
  if (!base64Match) return res.status(400).json({ error: 'Invalid image format. Supported: JPG, PNG, WEBP' });

  const mimeType = base64Match[1] === 'jpg' ? 'image/jpeg' : `image/${base64Match[1]}`;
  const base64Data = base64Match[2];
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) return res.status(500).json({ error: 'AI service is not configured.', code: 'MISSING_API_KEY' });

  const systemPrompt = `You are KalaSetu Smart Cataloguing AI. Help marginalized Indian artisans create accurate digital product listings from photographs and optional natural-language descriptions.

The photograph is the primary source of truth. The artisan description is additional context only. It may be short, informal, incomplete, or contain claims that cannot be verified from the image. Never fail merely because the description contains numbers, unusual wording, or a material such as gold. Do not invent visual details. Do not claim a material is verified solely because the artisan says it is genuine.

Return ONLY a valid JSON object with exactly these fields:
{
  "identified": "Short name of what the AI identified",
  "category": "One of: Pottery, Textiles, Jewellery, Woodwork, Bamboo, Metalwork, Embroidery, Other",
  "subcategory": "Specific product type within category",
  "title": "Professional marketplace product title",
  "description": "Concise 2-3 sentence e-commerce description",
  "materials": ["Material 1", "Material 2"],
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"],
  "minPrice": 800,
  "maxPrice": 1500
}

Give an indicative handmade-market price range in INR, normally ₹300–₹15,000, considering apparent material, craft complexity and likely Indian handmade-market positioning.

Return ONLY JSON. No markdown or explanation.`;

  const imagePart = { inlineData: { mimeType, data: base64Data } };
  const descriptionPart = {
    text: description
      ? `Optional artisan-provided description (context only, not verified fact):\n${description}`
      : 'No artisan description was provided. Rely on the product photograph.'
  };

  const callGemini = async (parts) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { maxOutputTokens: 1024, responseMimeType: 'application/json' }
      })
    });
  };

  try {
    let response = await callGemini([imagePart, descriptionPart]);

    // Description is optional. If Gemini rejects it for any reason, retry from the image.
    if (!response.ok && description) {
      console.warn('Gemini rejected description input; retrying image-only.');
      response = await callGemini([imagePart, { text: 'Analyze this product photograph and create the catalogue listing.' }]);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return res.status(502).json({ error: 'AI analysis service is temporarily unavailable. Please try again.', code: 'AI_SERVICE_ERROR' });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return res.status(502).json({ error: 'AI could not analyze this image. Please try a different photo.', code: 'EMPTY_AI_RESPONSE' });

    let result;
    try {
      result = JSON.parse(text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
    } catch {
      console.error('Failed to parse AI response as JSON:', text);
      return res.status(502).json({ error: 'AI response format error. Please try again.', code: 'PARSE_ERROR' });
    }

    const minPrice = typeof result.minPrice === 'number' && result.minPrice > 0 ? Math.round(result.minPrice) : 800;
    const maxPrice = typeof result.maxPrice === 'number' && result.maxPrice > minPrice ? Math.round(result.maxPrice) : Math.max(1500, minPrice + 500);

    return res.status(200).json({
      identified: result.identified || 'Handcrafted Artisan Product',
      category: result.category || 'Other',
      subcategory: result.subcategory || 'General',
      title: result.title || 'Handcrafted Artisan Product',
      description: result.description || 'A beautiful handmade product crafted with care.',
      materials: Array.isArray(result.materials) && result.materials.length ? result.materials.slice(0, 5) : ['Handcrafted'],
      tags: Array.isArray(result.tags) && result.tags.length ? result.tags.slice(0, 7) : ['Handmade', 'Traditional', 'India'],
      minPrice,
      maxPrice
    });
  } catch (error) {
    console.error('Analysis failed:', error.message);
    return res.status(500).json({ error: 'Something went wrong. Please try again.', code: 'INTERNAL_ERROR' });
  }
};