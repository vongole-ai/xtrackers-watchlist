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

const YF_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Connection': 'keep-alive',
  'Cache-Control': 'no-cache',
};

async function getCrumb(): Promise<{ crumb: string; cookie: string } | null> {
  try {
    const res = await fetch('https://query2.finance.yahoo.com/v1/test/getcrumb', {
      headers: YF_HEADERS,
    });
    if (!res.ok) return null;
    const crumb = await res.text();
    const cookie = res.headers.get('set-cookie') ?? '';
    return crumb && crumb !== 'null' ? { crumb, cookie } : null;
  } catch {
    return null;
  }
}

async function fetchBatch(tickers: string[], crumb?: string, cookie?: string): Promise<Record<string, QuoteResult>> {
  const symbolsParam = tickers.join(',');
  const endpoints = [
    `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbolsParam)}`,
    `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbolsParam)}`,
  ];

  for (const url of endpoints) {
    try {
      const fullUrl = crumb ? `${url}&crumb=${encodeURIComponent(crumb)}` : url;
      const headers: Record<string, string> = { ...YF_HEADERS };
      if (cookie) headers['Cookie'] = cookie;

      const res = await fetch(fullUrl, { headers });
      if (!res.ok) continue;

      const data = await res.json();
      const quoteList: any[] = data?.quoteResponse?.result ?? [];
      if (quoteList.length === 0) continue;

      const results: Record<string, QuoteResult> = {};
      for (const q of quoteList) {
        results[q.symbol] = {
          price:     q.regularMarketPrice         ?? null,
          change:    q.regularMarketChangePercent ?? null,
          changeAbs: q.regularMarketChange        ?? null,
          currency:  q.currency                   ?? null,
          prevClose: q.regularMarketPreviousClose ?? null,
          dayHigh:   q.regularMarketDayHigh       ?? null,
          dayLow:    q.regularMarketDayLow        ?? null,
        };
      }
      return results;
    } catch {
      continue;
    }
  }
  return {};
}

export async function GET() {
  const tickers = [...new Set(WATCHLIST.map((e) => e.yahooTicker))];

  const auth = await getCrumb();

  // Batch of 20 to stay within URL limits
  const BATCH = 20;
  const batches: string[][] = [];
  for (let i = 0; i < tickers.length; i += BATCH) {
    batches.push(tickers.slice(i, i + BATCH));
  }

  const allQuotes: Record<string, QuoteResult> = {};
  await Promise.all(
    batches.map(async (batch) => {
      const result = await fetchBatch(batch, auth?.crumb, auth?.cookie);
      Object.assign(allQuotes, result);
    })
  );

  const ok = Object.keys(allQuotes).length > 0;

  return NextResponse.json(
    { quotes: allQuotes, fetchedAt: new Date().toISOString(), ok },
    { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=60' } }
  );
}
