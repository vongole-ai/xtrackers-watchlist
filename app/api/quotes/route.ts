import { NextResponse } from 'next/server';
import { WATCHLIST } from '@/lib/watchlist';

export const runtime = 'nodejs';

type QuoteResult = {
  price: number | null;
  change: number | null;
  changeAbs: number | null;
  currency: string | null;
  prevClose: number | null;
  dayHigh: number | null;
  dayLow: number | null;
};

async function fetchYahooQuotes(
  tickers: string[]
): Promise<Record<string, QuoteResult>> {
  const symbolsParam = tickers.join(',');
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbolsParam)}&fields=regularMarketPrice,regularMarketChangePercent,regularMarketChange,regularMarketPreviousClose,regularMarketDayHigh,regularMarketDayLow,currency`;

  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      Accept: 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    next: { revalidate: 300 }, // cache 5 min at Next.js level
  });

  if (!res.ok) throw new Error(`Yahoo Finance HTTP ${res.status}`);

  const data = await res.json();
  const results: Record<string, QuoteResult> = {};

  const quoteList = data?.quoteResponse?.result ?? [];
  for (const q of quoteList) {
    results[q.symbol] = {
      price: q.regularMarketPrice ?? null,
      change: q.regularMarketChangePercent ?? null,
      changeAbs: q.regularMarketChange ?? null,
      currency: q.currency ?? null,
      prevClose: q.regularMarketPreviousClose ?? null,
      dayHigh: q.regularMarketDayHigh ?? null,
      dayLow: q.regularMarketDayLow ?? null,
    };
  }
  return results;
}

export async function GET() {
  const tickers = [...new Set(WATCHLIST.map((e) => e.yahooTicker))];

  try {
    const quotes = await fetchYahooQuotes(tickers);
    return NextResponse.json(
      { quotes, fetchedAt: new Date().toISOString(), ok: true },
      {
        headers: {
          'Cache-Control': 's-maxage=300, stale-while-revalidate=60',
        },
      }
    );
  } catch (err) {
    console.error('Yahoo Finance fetch error:', err);
    return NextResponse.json(
      { quotes: {}, fetchedAt: new Date().toISOString(), ok: false, error: String(err) },
      {
        status: 200, // return 200 so the client can still render static data
        headers: { 'Cache-Control': 'no-store' },
      }
    );
  }
}
