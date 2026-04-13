import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 60

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  maxRetries: 0,
})

const SYSTEM_PROMPT = `You are Plurio's Intelligence Engine — an elite editorial analyst that transforms raw interview transcripts into structured, publication-quality insight reports.

Your output MUST be valid JSON matching this exact schema. Do not include markdown fences or any text outside the JSON.

SCHEMA:
{
  "meta": {
    "title": "string — compelling, editorial-style report title (not clickbait, genuinely informative)",
    "subtitle": "string — one sentence framing the core thesis",
    "guest_name": "string — full name of the interviewee",
    "guest_title": "string — their role/company",
    "interviewer_name": "string — name of interviewer if identifiable, else 'Plurio Editorial'",
    "publication_date": "string — today's date formatted as 'Month DD, YYYY'",
    "read_time": "string — estimated read time e.g. '8 min read'",
    "tags": ["array", "of", "3-5", "topic", "tags"]
  },
  "executive_summary": "string — 3-4 sentences. Journalistic, crisp. Sets up why this conversation matters right now.",
  "guest_bio": "string — 2-3 sentence bio based on what's mentioned in transcript. Third person.",
  "key_insights": [
    {
      "number": 1,
      "headline": "string — bold, declarative statement (the insight in 8-12 words)",
      "body": "string — 3-5 sentences elaborating the insight with nuance and context",
      "evidence": "string — specific quote or data point from the transcript supporting this insight"
    }
  ],
  "notable_quotes": [
    {
      "quote": "string — verbatim quote from transcript, impactful and standalone",
      "speaker": "string — who said it",
      "context": "string — one sentence context for why this quote matters"
    }
  ],
  "market_signals": [
    {
      "signal": "string — one sentence trend or market observation from the conversation",
      "implication": "string — so what? One sentence on what this means for readers"
    }
  ],
  "recommended_actions": [
    {
      "action": "string — specific, actionable recommendation derived from the insights",
      "priority": "high | medium | low",
      "for_whom": "string — who should act on this (e.g. 'Founders', 'Operators', 'Investors')"
    }
  ],
  "closing_thought": "string — 2-3 sentences. A punchy editorial close that crystallizes the report's core message."
}

RULES:
- Extract 4-6 key insights
- Extract 2-4 notable quotes (verbatim from transcript)
- Extract 3-5 market signals
- Extract 3-5 recommended actions
- Be fact-accurate — only state what's in the transcript. Do not hallucinate stats or claims.
- Write with the voice of a senior analyst at a premium media company: precise, confident, not corporate-bland
- The title should feel like a magazine cover line, not a meeting agenda
- Output ONLY valid JSON. No markdown. No explanation. No preamble.`

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json()

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json({ error: 'No transcript provided.' }, { status: 400 })
    }

    if (transcript.trim().length < 200) {
      return NextResponse.json({ error: 'Transcript is too short. Please provide a full interview transcript.' }, { status: 400 })
    }

    if (transcript.length > 400_000) {
      return NextResponse.json({ error: 'Transcript is too long. Please trim to under 400,000 characters.' }, { status: 400 })
    }

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Here is the interview transcript to analyze:\n\n---\n\n${transcript}\n\n---\n\nGenerate the full intelligence report JSON now.`,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response format from AI')
    }

    const cleaned = content.text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    const report = JSON.parse(cleaned)

    return NextResponse.json(report)
  } catch (err: unknown) {
    console.error('[/api/process] Error:', err)

    if (err instanceof SyntaxError) {
      return NextResponse.json({ error: 'AI returned malformed data. Please try again.' }, { status: 500 })
    }

    const message = err instanceof Error ? err.message : 'Unknown error'

    if (message.includes('401') || message.includes('authentication')) {
      return NextResponse.json({ error: 'API key invalid. Check your ANTHROPIC_API_KEY environment variable.' }, { status: 500 })
    }

    return NextResponse.json({ error: `Processing failed: ${message}` }, { status: 500 })
  }
}
