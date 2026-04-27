import type { VercelRequest, VercelResponse } from '@vercel/node';

interface WikiEntrySnippet {
  id: string;
  title: string;
  body: string;
  type?: string;
  constraints: string[];
  areas: string[];
  source?: string;
  tags?: string[];
  contributor: string;
}

interface ClaudeRequest {
  query: string;
  entries: WikiEntrySnippet[];
}

interface ClaudeResponse {
  text: string;
  entryIds: string[];
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { query, entries } = req.body as ClaudeRequest;

  if (!query || typeof query !== 'string') {
    res.status(400).json({ error: 'query is required' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured' });
    return;
  }

  const entrySummary = (entries ?? [])
    .map(e =>
      `ID: ${e.id}\nTitle: ${e.title}\nType: ${e.type ?? 'N/A'}\nAreas: ${e.areas.join(', ')}\nConstraints: ${e.constraints.join(', ')}\nBody: ${e.body}`
    )
    .join('\n\n---\n\n');

  const systemPrompt = `You are a knowledgeable assistant for a Product Insight Wiki. Your job is to help users find and understand information in the wiki.

Respond ONLY with a JSON object (no markdown, no code fences) with exactly two keys:
- "text": a concise, helpful answer (2–4 sentences) that directly addresses the user's question
- "entryIds": an array of the most relevant wiki entry IDs (max 5) that support your answer, e.g. ["ENT-001","ENT-003"]

If no entries are relevant, return an empty array for entryIds.`;

  const userMessage = `Here are the current wiki entries:\n\n${entrySummary}\n\n---\n\nUser question: ${query}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 512,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', errText);
      res.status(502).json({ error: 'Upstream API error' });
      return;
    }

    const data = await response.json() as { content: { type: string; text: string }[] };
    const rawText = data.content.find(b => b.type === 'text')?.text ?? '{}';

    let parsed: ClaudeResponse;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      // Claude returned prose instead of JSON — wrap it gracefully
      parsed = { text: rawText, entryIds: [] };
    }

    res.status(200).json(parsed);
  } catch (err) {
    console.error('Claude proxy error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
