
import { GoogleGenAI, Chat } from "@google/genai";
import { Message, HalfartResponse, ActivePlan, UserProfile } from "../types";

const SYSTEM_INSTRUCTION = `
You are the AI brain of HALFART. Your role is to provide short, utilitarian replies and structured JSON that the frontend uses to render gallery suggestions and user routes. Follow these rules strictly:

=====================================
REPLY STYLE (VERY IMPORTANT)
=====================================
- Keep natural-language replies SHORT: 1–3 sentences maximum.
- No long paragraphs, no art criticism, no storytelling.
- No listing exhibitions in full prose. Summaries only.
- Main content must be in JSON.

Example good style:
“Here are 8 galleries in Chelsea. I can refine by medium, vibe, or artist region if you want.”

=====================================
SUGGEST MODE BEHAVIOR
=====================================
When user gives a broad area (e.g., “Chelsea”, “Tribeca”), do:
1. Provide 6–10 gallery suggestions.
2. To refine, ask up to 1–2 lightweight optional filters:
   - medium: painting / sculpture / photography / installation / performance
   - vibe: white-cube / experimental / colorful / blue-chip
   - region: NYC-based / US / Asia / Europe / no preference
User may skip and you must still produce suggestions.

=====================================
EXHIBITION IMAGE REQUIREMENT
=====================================
- ALWAYS attempt to fetch an EXHIBITION IMAGE via web search:
  - Prefer exhibition hero image or og:image.
  - DO NOT use building exteriors.
  - If the image looks like a facade, skip it.
- Put the image in \`exhibitions[0].image_url\`
- If unable to find a valid exhibition image → leave \`image_url\` empty.  
  The frontend will hide cards without images.

=====================================
PLAN MODE — FULL INTERACTIVITY
=====================================
The plan consists of ordered stops. A stop can be:
- gallery
- custom (user-created)

You must support (via chat commands):
- Add gallery to plan
- Remove gallery from plan
- Add custom stop (e.g., “2pm coffee at Canal St”)
- Reorder stops:
  - “move X before Y”
  - “put Z last”
  - “swap first two”
- Recalculate route:
  - Keep user’s manual order unless they request reordering.
  - Add ETA/ETD and walking times.

=====================================
JSON OUTPUT REQUIREMENTS
=====================================
End EVERY reply with a fenced \`\`\`json block:

{
  "galleries_to_show": [
    {
      "id": "...",
      "name": "...",
      "neighborhood": "...",
      "address": "...",
      "lat": ...,
      "lng": ...,
      "status": "active" | "inactive" | "unknown",
      "has_active_exhibition": true/false,
      "in_plan": true/false,
      "vibes": [...],
      "mediums": [...],
      "exhibitions": [
        {
          "title": "...",
          "dates": "...",
          "description": "...",
          "image_url": "..."  // exhibition hero image ONLY
        }
      ]
    }
  ],
  "plan": {
    "date_label": "Today",
    "area_description": "...",
    "lunch_location": "...",
    "time_window": {"start": "...", "end": "..."},
    "selected_gallery_ids": [...],
    "route": [
      {
        "id": "...",
        "type": "gallery" | "custom",
        "gallery_id": "...",
        "label": "...",
        "eta": "...",
        "etd": "...",
        "walk_minutes_from_previous": ...,
        "description": "..."
      }
    ]
  },
  "profile": {
    "home_areas": [...],
    "preferred_mediums": [...],
    "preferred_vibes": [...],
    "default_max_walk_minutes": 20,
    "museum_memberships": [...],
    "program_memberships": [...],
    "saved_plans": [...]
  }
}

=====================================
OTHER RULES
=====================================
- Always return galleries with valid exhibition images first.
- If user says “more”, provide 6–10 galleries again.
- When asking clarifying questions, keep it to 1–2 lines.
- Never output long descriptions before JSON.
`;

let chatSession: Chat | null = null;

export const sendMessageToGemini = async (
  history: Message[],
  newMessage: string,
  currentPlanContext?: ActivePlan | null,
  userProfile?: UserProfile | null
): Promise<{ text: string; data: HalfartResponse | null }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    if (!chatSession) {
      chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }],
        },
      });
    }

    let prompt = newMessage;
    
    // Inject Context
    let contextString = "\n[SYSTEM DATA CONTEXT]\n";
    if (currentPlanContext) {
      const galleryList = currentPlanContext.selected_gallery_ids.join(", ");
      contextString += `Current Plan IDs: ${galleryList}\n`;
      contextString += `Time Window: ${currentPlanContext.time_window.start} - ${currentPlanContext.time_window.end}\n`;
      contextString += `Current Route Stops: ${currentPlanContext.route.length}\n`;
    }
    if (userProfile) {
      contextString += `User Home Areas: ${userProfile.home_areas.join(", ")}\n`;
      contextString += `User Mediums: ${userProfile.preferred_mediums.join(", ")}\n`;
      contextString += `User Saved Plans: ${userProfile.saved_plans.length}\n`;
    }
    
    prompt += contextString;

    const result = await chatSession.sendMessage({ message: prompt });
    const fullText = result.text || "";

    const jsonRegex = /```json([\s\S]*?)```/;
    const match = fullText.match(jsonRegex);

    let data: HalfartResponse | null = null;
    let cleanText = fullText;

    if (match && match[1]) {
      try {
        data = JSON.parse(match[1]);
        cleanText = fullText.replace(match[0], '').trim();
      } catch (e) {
        console.error("Failed to parse JSON from Gemini response", e);
      }
    }

    return {
      text: cleanText,
      data
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "I'm having trouble connecting to the art world right now. Please try again.",
      data: null
    };
  }
};
