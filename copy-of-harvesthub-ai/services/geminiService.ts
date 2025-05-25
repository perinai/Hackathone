
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { PriceSuggestion, BuyerMatch, MarketTrend } from '../types';
import { GEMINI_TEXT_MODEL } from '../constants';

// Ensure API_KEY is available. In a real app, this would be handled by the build process or server environment.
// For this exercise, we assume process.env.API_KEY is defined.
// If not defined, you can set it for local testing like:
// const API_KEY = process.env.API_KEY || "YOUR_API_KEY_HERE_FOR_LOCAL_TESTING_ONLY"; 
// However, the prompt strictly says to use process.env.API_KEY directly.

const getApiKey = (): string => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY environment variable is not set. Gemini API calls will likely fail.");
    // To prevent app from crashing if API_KEY is not set, but calls will fail.
    // In a real app, you might throw an error or handle this more gracefully.
    return "MISSING_API_KEY"; 
  }
  return apiKey;
}

let ai: GoogleGenAI | null = null;
try {
    ai = new GoogleGenAI({ apiKey: getApiKey() });
} catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
    // AI features will not be available.
}


const parseJsonFromText = <T,>(text: string): T | null => {
  let jsonStr = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s; // Matches ```json ... ``` or ``` ... ```
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini:", e, "Raw text:", text);
    return null;
  }
};

export const getMarketPriceSuggestion = async (produceName: string, region: string, currentPrice?: number): Promise<PriceSuggestion | null> => {
  if (!ai || getApiKey() === "MISSING_API_KEY") {
    console.warn("Gemini AI not initialized or API Key missing. Returning mock price suggestion.");
    // Mock response if AI is not available
    return {
      minPrice: (currentPrice || 5) * 0.9,
      maxPrice: (currentPrice || 5) * 1.1,
      currency: "USD",
      message: `AI Tip: Similar ${produceName} in ${region} are currently listed between $${((currentPrice || 5) * 0.9).toFixed(2)} - $${((currentPrice || 5) * 1.1).toFixed(2)} per unit. (Mock Data)`
    };
  }

  const prompt = `
    Provide a market price suggestion for "${produceName}" in the region of "${region}".
    The current listed price by the farmer is ${currentPrice ? `$${currentPrice.toFixed(2)}` : 'not specified'}.
    Consider factors like seasonality, demand, and typical organic/local premiums if applicable.
    Respond in JSON format with the following structure:
    {
      "minPrice": float, // Estimated minimum competitive price
      "maxPrice": float, // Estimated maximum competitive price
      "currency": "USD", // Currency code
      "message": "string" // A concise, helpful message for the farmer, e.g., 'Similar [produce] in [region] are listed between $X - $Y. Pricing competitively often sees quicker interest!'
    }
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: [{ role: "user", parts: [{text: prompt}] }],
      config: {
        responseMimeType: "application/json",
        // For low latency suggestions, disable thinking. For more thorough analysis, omit thinkingConfig.
        // Let's assume this is for quick guidance, so disable thinking.
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    
    const textResponse = response.text;
    if (!textResponse) {
        console.error("Gemini API returned no text for price suggestion.");
        return null;
    }
    
    return parseJsonFromText<PriceSuggestion>(textResponse);

  } catch (error) {
    console.error("Error fetching market price suggestion from Gemini:", error);
    // Fallback mock response on error
    return {
      minPrice: (currentPrice || 5) * 0.85,
      maxPrice: (currentPrice || 5) * 1.15,
      currency: "USD",
      message: `Error fetching AI suggestion. Based on general data, consider a range around $${((currentPrice || 5) * 0.85).toFixed(2)} - $${((currentPrice || 5) * 1.15).toFixed(2)}. (Error Fallback)`
    };
  }
};

export const getAIPersonalizedTip = async (context: string, userRole: 'farmer' | 'buyer'): Promise<string | null> => {
  if (!ai || getApiKey() === "MISSING_API_KEY") {
    console.warn("Gemini AI not initialized. Returning mock tip.");
    return "Mock AI Tip: Engage with your community for best results!";
  }

  const prompt = `
    Provide a short, encouraging, and actionable personalized tip for a ${userRole} on an online marketplace.
    The current context is: "${context}".
    The tip should be 1-2 sentences.
    Example Farmer Tip: "Farmers who respond to inquiries within 2 hours often build stronger buyer relationships!"
    Example Buyer Tip: "Building a direct relationship with a farmer can ensure you get the best, freshest produce consistently!"
    Generate a new, relevant tip.
  `;
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: [{ role: "user", parts: [{text: prompt}] }],
       config: {
        // For quick tips, thinking might be less critical.
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    return response.text.trim() || "AI Tip: Keep your listings updated for maximum visibility!";
  } catch (error) {
    console.error("Error fetching personalized tip from Gemini:", error);
    return "AI Tip: Explore all features to make the most of HarvestHub AI! (Error Fallback)";
  }
};


export const generateProduceDescription = async (produceName: string, keywords: string[]): Promise<string | null> => {
    if (!ai || getApiKey() === "MISSING_API_KEY") {
        console.warn("Gemini AI not initialized. Cannot generate description.");
        return `This is a fine ${produceName}. Grown with care and attention. Keywords: ${keywords.join(', ')}. (Mock Description)`;
    }

    const prompt = `
        Generate a compelling and brief (2-3 sentences) product description for "${produceName}".
        Highlight its qualities based on these keywords: ${keywords.join(', ')}.
        Make it appealing for a local food marketplace.
        Example for "Heirloom Tomatoes" with keywords "sun-ripened, flavorful, organic":
        "Indulge in these exquisite sun-ripened heirloom tomatoes, bursting with authentic flavor! Grown organically with love, they're perfect for elevating your salads, sauces, or enjoying as a healthy snack."
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: GEMINI_TEXT_MODEL,
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                temperature: 0.7, // For creative text
            }
        });
        return response.text.trim() || null;
    } catch (error) {
        console.error("Error generating produce description with Gemini:", error);
        return null;
    }
};

// Add more functions for Buyer-Farmer Matching, Market Insights etc. as needed.
// These would follow similar patterns, constructing a prompt and parsing the JSON response.
// For example, Buyer-Farmer matching:
export const findPotentialBuyerMatches = async (farmerProduceListings: {name: string, category: string, quantity: number}[], farmerLocation: string): Promise<BuyerMatch[] | null> => {
    if (!ai || getApiKey() === "MISSING_API_KEY") {
        console.warn("Gemini AI not initialized. Returning mock buyer matches.");
        return [
            { buyerId: "mockBuyer1", buyerName: "The Gourmet Kitchen", buyerType: "Restaurant", location: "Nearby Town", lookingFor: farmerProduceListings[0]?.name || "Fresh Produce", message: "Actively seeking local ingredients. (Mock Data)"},
        ];
    }

    const prompt = `
        A farmer at "${farmerLocation}" has the following produce available:
        ${farmerProduceListings.map(p => `- ${p.name} (${p.category}), Quantity: ${p.quantity}`).join('\n')}

        Identify potential buyer matches (e.g., restaurants, grocers, co-ops) in or near this region
        who might be interested in this type of produce.
        For each match, provide details in JSON format as an array of objects:
        [
          {
            "buyerId": "unique_buyer_id_or_name", // Can be a descriptive name if ID not known
            "buyerName": "string", // Business Name
            "buyerType": "string", // e.g., Restaurant, Grocer, Co-op
            "location": "string", // General location of buyer
            "lookingFor": "string", // Specific produce they might be interested in from the farmer's list
            "quantityRange": "string", // Optional: e.g., "small batches", "bulk orders"
            "message": "string" // A brief note, e.g., "Known to source local organic vegetables."
          }
        ]
        Limit to 3 potential matches.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: GEMINI_TEXT_MODEL,
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
            }
        });
        const textResponse = response.text;
        if (!textResponse) {
            console.error("Gemini API returned no text for buyer matches.");
            return null;
        }
        return parseJsonFromText<BuyerMatch[]>(textResponse);
    } catch (error) {
        console.error("Error finding buyer matches with Gemini:", error);
        return null;
    }
};

// Placeholder for image generation if needed
export const generateFarmBannerImage = async (farmName: string, farmStyle: string): Promise<string | null> => {
    if (!ai || getApiKey() === "MISSING_API_KEY" || !ai.models.generateImages) { // Check if generateImages exists
        console.warn("Gemini AI (Image Model) not initialized or method unavailable. Returning placeholder image URL.");
        return `https://picsum.photos/seed/${farmName.replace(/\s+/g, '-')}/1200/300`; // Placeholder
    }
    
    // This is a conceptual example. The 'imagen-3.0-generate-002' model might not be available to all,
    // or might have specific prompting needs.
    const prompt = `A beautiful, welcoming farm banner image for "${farmName}". The style is "${farmStyle}". Focus on vibrant colors and a sense of abundance.`;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002', // Use the correct model name as per guidelines
            prompt: prompt,
            config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
        });

        if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image.imageBytes) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        return null;
    } catch (error) {
        console.error("Error generating farm banner image with Gemini:", error);
        return `https://picsum.photos/seed/${farmName.replace(/\s+/g, '-')}/1200/300`; // Placeholder on error
    }
};

    