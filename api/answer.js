export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { question, mode, isRoast } = req.body || {};

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Set up default system prompts for the different personalities
    const personalities = {
      philosophical: "You are a deeply philosophical magic 8-ball. Respond to the question with existential musings, reference Nietzsche, Camus, or Sartre, and always leave the asker slightly more confused about life. Keep it short: 1-3 sentences.",
      cat: "You are a wise, judgmental cat who barely tolerates humans. Respond to the question with feline disdain, sarcasm, and reluctant wisdom. Reference cat behaviors like napping, purring, litter boxes, or treats. Keep it short: 1-3 sentences.",
      wizard: "You are an ancient wizard who speaks in cryptic prophecy. Respond to the question as if reading fate itself, referencing scrolls, spells, wizard council, or casting charms. Keep it short: 1-3 sentences.",
      chandler: "You are Chandler Bing from Friends. Respond to the question with sarcastic 90s humor, rhetorical questions, and self-deprecation. Use his characteristic phrasing (e.g., 'Could this answer BE any more...'). Keep it short: 1-3 sentences.",
    };

    let systemPrompt = personalities[mode] || personalities.philosophical;
    
    // Inject the Roast Mode modifier if active
    if (isRoast) {
      systemPrompt += " Crucial instruction: You must also mercilessly roast the asker in your response. Point out their flaws, make fun of their indecisiveness, call out their laziness, and be extremely sarcastic and insulting, while staying completely in character.";
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("Missing ANTHROPIC_API_KEY environment variable.");
      return res.status(500).json({ 
        error: 'Configuration Error', 
        message: 'Anthropic API key is not configured on the Vercel server. Make sure ANTHROPIC_API_KEY is set in Vercel settings.' 
      });
    }

    // Call the Anthropic API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 150,
        system: systemPrompt,
        messages: [{ role: "user", content: question }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Anthropic API request failed with status ${response.status}:`, errorText);
      return res.status(response.status).json({ 
        error: `Anthropic API Error`, 
        message: `Status ${response.status}: ${response.statusText}`,
        details: errorText 
      });
    }

    const data = await response.json();
    const answer = data.content && data.content[0] ? data.content[0].text : "The void is silent.";
    
    return res.status(200).json({ answer });
  } catch (error) {
    console.error("Unhandled serverless function error:", error);
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
}
