/**
 * AI narration generator.
 * Builds prompts and calls AI APIs (OpenAI/Anthropic) to generate
 * documentary-style narration for satellite stories.
 */

interface NarrationContext {
  satelliteName: string;
  missionType: string;
  country: string;
  altitude: number;
  speed: number;
  currentLat: number;
  currentLng: number;
  overCountry: string | null;
  nextCountries: string[];
  funFact?: string;
}

/**
 * Build a prompt for AI narration generation.
 * Creates rich context so the AI can produce vivid, documentary-style text.
 */
export function buildNarrationPrompt(context: NarrationContext): string {
  const location = context.overCountry
    ? `passing over ${context.overCountry}`
    : `over the ocean at ${context.currentLat.toFixed(1)}°N, ${context.currentLng.toFixed(1)}°E`;

  const nextLocations = context.nextCountries.length > 0
    ? `It will next pass over ${context.nextCountries.slice(0, 3).join(", ")}.`
    : "";

  return `You are the narrator of a cinematic space documentary called "Orbitra: Every Satellite Has a Story."

Write a short, vivid narration paragraph (2-4 sentences) about ${context.satelliteName}, a ${context.missionType} satellite from ${context.country}.

Current status:
- Altitude: ${context.altitude} km
- Speed: ${context.speed} km/s
- Currently ${location}
- ${nextLocations}

${context.funFact ? `Fun fact: ${context.funFact}` : ""}

The tone should be:
- Poetic but factual, like a nature documentary
- Evoke wonder and appreciation for space technology
- Make the satellite feel like a character on a journey
- Between 40-80 words
- No markdown, just plain text

Narration:`;
}

/**
 * Generate narration text.
 * In production, this calls OpenAI/Anthropic API.
 * For development, returns template-based narration.
 */
export async function generateNarration(context: NarrationContext): Promise<string> {
  const prompt = buildNarrationPrompt(context);

  // In production:
  // const response = await fetch("https://api.anthropic.com/v1/messages", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "x-api-key": process.env.ANTHROPIC_API_KEY!,
  //     "anthropic-version": "2023-06-01",
  //   },
  //   body: JSON.stringify({
  //     model: "claude-sonnet-5-20251001",
  //     max_tokens: 200,
  //     messages: [{ role: "user", content: prompt }],
  //   }),
  // });
  // const data = await response.json();
  // return data.content[0].text;

  // Development fallback: template-based narration
  return generateTemplateNarration(context);
}

/**
 * Template-based narration fallback for when AI is unavailable.
 */
function generateTemplateNarration(context: NarrationContext): string {
  const templates = [
    `${context.satelliteName} glides silently at ${context.altitude} kilometers above Earth, its sensors sweeping across the surface below at ${context.speed} kilometers per second. A marvel of ${context.country}'s space program, this ${context.missionType} satellite continues its tireless vigil, collecting data that shapes our understanding of the world.`,
    `At ${context.altitude} kilometers up, ${context.satelliteName} traces its orbital path with precision. Every orbit reveals new details about our planet, continuing ${context.country}'s legacy of space-based ${context.missionType.toLowerCase()}. Speed: ${context.speed} kilometers per second — fast enough to circle Earth in just 90 minutes.`,
    `High above, ${context.satelliteName} watches. This ${context.missionType.toLowerCase()} satellite from ${context.country} orbits at ${context.altitude} km, moving at ${context.speed} km/s. It's one of thousands of silent sentinels that make modern life possible — from weather forecasts to GPS navigation.`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}
