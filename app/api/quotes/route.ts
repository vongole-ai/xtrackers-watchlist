import { NextResponse } from 'next/server';
import { WATCHLIST } from '@/lib/watchlist';

export const runtime = 'nodejs';

type QuoteResult = {
  price: number | null;
  change: number | null;
  currency: string | null;
};

// ── Source 1: Yahoo Finance ───────────────────────────────────────────────
async function fetchYahoo(tickers: string[]): Promise<Record<string, QuoteResult>> {
  const symbols = tickers.join(',');
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.9',
  };

  for (const host of ['query2', 'query1']) {
    try {
      const res = await fetch(
        `https://${host}.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols)}`,
        { headers, signal: AbortSignal.timeout(8000) }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const list: any[] = data?.quoteResponse?.result ?? [];
      if (!list.length) continue;

      const out: Record<string, QuoteResult> = {};
      for (const q of list) {
        out[q.symbol] = {
          price:    q.regularMarketPrice           ?? null,
          change:   q.regularMarketChangePercent   ?? null,
          currency: q.currency                     ?? 'EUR',
        };
      }
      return out;
    } catch { continue; }
  }
  return {};
}

// ── Source 2: Stooq (European market data, no API key needed) ────────────
async function fetchStooq(ticker: string): Promise<QuoteResult | null> {
  // Stooq format: lowercase ticker with .de suffix
  const symbol = ticker.toLowerCase();
  try {
    const res = await fetch(
      `https://stooq.com/q/l/?s=${symbol}&f=sd2t2ohlcv&h&e=csv`,
      { signal: AbortSignal.timeout(6000) }
    );
    if (!res.ok) return null;
    const text = await res.text();
    const lines = text.trim().split('\n');
    if (lines.length < 2) return null;

    const cols = lines[1].split(',');
    // CSV format: Symbol,Date,Time,Open,High,Low,Close,Volume
    const close = parseFloat(cols[6]);
    const open  = parseFloat(cols[3]);
    if (isNaN(close) || close === 0) return null;

    const change = open ? ((close - open) / open) * 100 : null;
    return { price: close, change, currency: 'EUR' };
  } catch {
    return null;
  }
}

export async function GET() {
  const tickers = [...new Set(WATCHLIST.map((e) => e.yahooTicker))];

  // Try Yahoo Finance first (batch)
  let quotes = await fetchYahoo(tickers);
  let source = 'yahoo';

  // If Yahoo fails, fall back to Stooq (parallel per ticker)
  if (Object.keys(quotes).length === 0) {
    source = 'stooq';
    const stooqResults = await Promise.allSettled(
      tickers.map(async (t) => ({ ticker: t, data: await fetchStooq(t) }))
    );
    for (const r of stooqResults) {
      if (r.status === 'fulfilled' && r.value.data) {
        quotes[r.value.ticker] = r.value.data;
      }
    }
  }

  // For Yahoo misses, try Stooq individually as fill-in
  if (source === 'yahoo') {
    const missing = tickers.filter(t => !quotes[t]);
    if (missing.length > 0) {
      const fills = await Promise.allSettled(
        missing.map(async (t) => ({ ticker: t, data: await fetchStooq(t) }))
      );
      for (const r of fills) {
        if (r.status === 'fulfilled' && r.value.data) {
          quotes[r.value.ticker] = r.value.data;
        }
      }
    }
  }

  return NextResponse.json(
    { quotes, fetchedAt: new Date().toISOString(), ok: true, source },
    { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=60' } }
  );
}
