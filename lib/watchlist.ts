export type Tab = 'factors' | 'world-sectors' | 'eu-sectors' | 'thematic' | 'size';

export type ETF = {
  name: string;
  isin: string;
  // Yahoo Finance ticker on Xetra (IBIS2). Marked with * if high confidence.
  // Update these if Yahoo Finance returns N/A for a ticker.
  yahooTicker: string;
  ter: number;
  aumM: number; // EUR millions
  ytd: number | null;       // YTD % (3/26 data from Xtrackers)
  y2526: number | null;     // 3/25–3/26 %
  y2425: number | null;     // 3/24–3/25 %
  tab: Tab;
  group?: string;
};

// TICKER NOTES:
// * = high confidence (verified pattern or well-known)
// ‡ = estimated from Xtrackers naming convention — may need updating
// To verify a ticker: search ISIN on finance.yahoo.com and confirm .DE listing

export const WATCHLIST: ETF[] = [
  // ─── FACTORES ────────────────────────────────────────────────────────────
  { name: 'MSCI World Value',           isin: 'IE00BL25JM42', yahooTicker: 'XDEV.DE',  ter: 0.25, aumM: 3891, ytd: 14.27, y2526: 34.74, y2425: 5.30,  tab: 'factors' },
  { name: 'MSCI World Momentum',        isin: 'IE00BL25JP72', yahooTicker: 'XDWM.DE',  ter: 0.25, aumM: 1654, ytd: 8.98,  y2526: 16.89, y2425: 7.37,  tab: 'factors' },
  { name: 'MSCI World Quality',         isin: 'IE00BL25JL35', yahooTicker: 'XDWQ.DE',  ter: 0.25, aumM: 2480, ytd: 4.69,  y2526: 14.84, y2425: 3.84,  tab: 'factors' },
  { name: 'MSCI World Min Volatility',  isin: 'IE00BL25JN58', yahooTicker: 'XDWL.DE',  ter: 0.25, aumM: 878,  ytd: 0.25,  y2526: 2.58,  y2425: 13.28, tab: 'factors' },
  { name: 'S&P 500 Equal Weight',       isin: 'IE00BLNMYC90', yahooTicker: 'XEWE.DE',  ter: 0.15, aumM: 10806,ytd: 5.18,  y2526: 12.37, y2425: 3.58,  tab: 'factors' }, // *
  { name: 'S&P 500 EW Scored & Screened',isin:'IE0004MFRED4', yahooTicker: 'XDEW.DE',  ter: 0.17, aumM: 2343, ytd: 5.43,  y2526: 15.18, y2425: 2.54,  tab: 'factors' },
  { name: 'MSCI Europe Value',           isin: 'LU0486851024', yahooTicker: 'XVER.DE',  ter: 0.15, aumM: 241,  ytd: 7.48,  y2526: 25.85, y2425: 14.48, tab: 'factors' },
  { name: 'MSCI World Quality ESG',      isin: 'IE0003NQ0IY5', yahooTicker: 'XWQE.DE',  ter: 0.25, aumM: 167,  ytd: 4.84,  y2526: 18.73, y2425: 2.30,  tab: 'factors' },
  { name: 'NA High Dividend Yield',      isin: 'IE00BH361H73', yahooTicker: 'XNAHD.DE', ter: 0.39, aumM: 119,  ytd: 7.38,  y2526: 13.42, y2425: 7.46,  tab: 'factors' },

  // ─── SECTORES GLOBALES (MSCI World) ──────────────────────────────────────
  { name: 'World Energy',               isin: 'IE00BM67HM91', yahooTicker: 'XWEN.DE',  ter: 0.25, aumM: 1762, ytd: 29.92, y2526: 41.19, y2425: 3.26,  tab: 'world-sectors' },
  { name: 'World Utilities',            isin: 'IE00BM67HQ30', yahooTicker: 'XWUT.DE',  ter: 0.25, aumM: 802,  ytd: 11.29, y2526: 26.91, y2425: 19.89, tab: 'world-sectors' },
  { name: 'World Materials',            isin: 'IE00BM67HS53', yahooTicker: 'XWMT.DE',  ter: 0.25, aumM: 607,  ytd: 12.31, y2526: 30.73, y2425: -5.02, tab: 'world-sectors' },
  { name: 'World Industrials',          isin: 'IE00BM67HV82', yahooTicker: 'XWIN.DE',  ter: 0.25, aumM: 811,  ytd: 9.81,  y2526: 25.11, y2425: 5.63,  tab: 'world-sectors' },
  { name: 'World IT',                   isin: 'IE00BM67HT60', yahooTicker: 'XWIT.DE',  ter: 0.25, aumM: 4677, ytd: 7.10,  y2526: 27.34, y2425: 3.95,  tab: 'world-sectors' },
  { name: 'World Communication Svcs',   isin: 'IE00BM67HR47', yahooTicker: 'XWCO.DE',  ter: 0.25, aumM: 450,  ytd: 3.50,  y2526: 27.28, y2425: 15.03, tab: 'world-sectors' },
  { name: 'World Consumer Staples',     isin: 'IE00BM67HN09', yahooTicker: 'XWCN.DE',  ter: 0.25, aumM: 740,  ytd: 5.92,  y2526: 6.78,  y2425: 8.39,  tab: 'world-sectors' },
  { name: 'World Financials',           isin: 'IE00BM67HL84', yahooTicker: 'XWFN.DE',  ter: 0.25, aumM: 747,  ytd: -0.56, y2526: 12.74, y2425: 21.79, tab: 'world-sectors' },
  { name: 'World Consumer Discret.',    isin: 'IE00BM67HP23', yahooTicker: 'XWCD.DE',  ter: 0.25, aumM: 262,  ytd: -3.14, y2526: 7.65,  y2425: 2.08,  tab: 'world-sectors' },
  { name: 'World Health Care',          isin: 'IE00BM67HK77', yahooTicker: 'XWHE.DE',  ter: 0.25, aumM: 2683, ytd: -6.11, y2526: 4.21,  y2425: -1.15, tab: 'world-sectors' },

  // ─── SECTORES EUROPA (MSCI Europe Screened) ──────────────────────────────
  { name: 'Europe Utilities',           isin: 'LU0292104899', yahooTicker: 'XS7U.DE',  ter: 0.17, aumM: 78,   ytd: 16.65, y2526: 34.74, y2425: 16.87, tab: 'eu-sectors' },
  { name: 'Europe Financials',          isin: 'LU0292103651', yahooTicker: 'XS7F.DE',  ter: 0.17, aumM: 131,  ytd: 1.43,  y2526: 15.03, y2425: 30.44, tab: 'eu-sectors' },
  { name: 'Europe Industrials',         isin: 'LU0292106084', yahooTicker: 'XS7I.DE',  ter: 0.17, aumM: 37,   ytd: 6.75,  y2526: 8.69,  y2425: 6.63,  tab: 'eu-sectors' },
  { name: 'Europe Comm. Services',      isin: 'LU0292104030', yahooTicker: 'XS7T.DE',  ter: 0.17, aumM: 9,    ytd: 2.65,  y2526: -1.36, y2425: 26.35, tab: 'eu-sectors' },
  { name: 'Europe Materials',           isin: 'LU0292100806', yahooTicker: 'XS7M.DE',  ter: 0.17, aumM: 41,   ytd: 1.90,  y2526: 2.23,  y2425: -4.41, tab: 'eu-sectors' },
  { name: 'Europe Consumer Staples',    isin: 'LU0292105359', yahooTicker: 'XS7G.DE',  ter: 0.17, aumM: 48,   ytd: -2.10, y2526: -6.53, y2425: -6.69, tab: 'eu-sectors' },
  { name: 'Europe Health Care',         isin: 'LU0292103222', yahooTicker: 'XS7H.DE',  ter: 0.17, aumM: 259,  ytd: -3.86, y2526: 1.15,  y2425: -3.41, tab: 'eu-sectors' },
  { name: 'Europe IT',                  isin: 'LU0292104469', yahooTicker: 'XS7K.DE',  ter: 0.17, aumM: 30,   ytd: -14.21,y2526: -27.09,y2425:-16.48, tab: 'eu-sectors' },
  { name: 'Europe Broad (ref)',         isin: 'LU0322253732', yahooTicker: 'XESC.DE',  ter: 0.12, aumM: 79,   ytd: 2.61,  y2526: 17.66, y2425: 5.06,  tab: 'eu-sectors', group: 'ref' },
  { name: 'Europe Real Estate',         isin: 'LU0489337690', yahooTicker: 'XDER.DE',  ter: 0.33, aumM: 692,  ytd: 0.93,  y2526: 2.25,  y2425: -1.76, tab: 'eu-sectors', group: 'ref' },

  // ─── TEMÁTICOS ────────────────────────────────────────────────────────────
  { name: 'AI & Big Data',              isin: 'IE00BGV5VN51', yahooTicker: 'XAIX.DE',  ter: 0.35, aumM: 6087, ytd: 9.28,  y2526: 26.47, y2425: 5.41,  tab: 'thematic', group: 'tech' }, // *
  { name: 'Future Mobility',            isin: 'IE00BGV5VR99', yahooTicker: 'XFMV.DE',  ter: 0.35, aumM: 158,  ytd: 11.40, y2526: 25.97, y2425: 0.78,  tab: 'thematic', group: 'tech' },
  { name: 'Fintech Innovation',         isin: 'IE000YDOORK7', yahooTicker: 'XFIN.DE',  ter: 0.30, aumM: 10,   ytd: -9.05, y2526: -7.29, y2425: 19.23, tab: 'thematic', group: 'tech' },
  { name: 'S&P Global Infrastructure', isin: 'LU0322253229', yahooTicker: 'XSGN.DE',  ter: 0.60, aumM: 481,  ytd: 9.61,  y2526: 25.40, y2425: 17.42, tab: 'thematic', group: 'infra' },
  { name: 'Global Infrastructure ESG', isin: 'IE00BYZNF849', yahooTicker: 'XGIE.DE',  ter: 0.35, aumM: 12,   ytd: 8.25,  y2526: 16.64, y2425: null,  tab: 'thematic', group: 'infra' },
  { name: 'Europe Defence Tech',        isin: 'LU3061478973', yahooTicker: 'XDEF.DE',  ter: 0.25, aumM: 38,   ytd: null,  y2526: null,  y2425: null,  tab: 'thematic', group: 'infra' },
  { name: 'Clean Energy (SDG 7)',       isin: 'IE000JZYIUN0', yahooTicker: 'XDCE.DE',  ter: 0.35, aumM: 24,   ytd: 26.66, y2526: 60.34, y2425: -13.83,tab: 'thematic', group: 'infra' },

  // ─── TAMAÑO / REFERENCIA ──────────────────────────────────────────────────
  { name: 'Russell 2000 (US Small)',    isin: 'IE00BJZ2DD79', yahooTicker: 'XRS2.DE',  ter: 0.30, aumM: 2157, ytd: 11.26, y2526: 25.10, y2425: -4.47, tab: 'size' }, // *
  { name: 'MSCI Europe Small Cap',      isin: 'LU0322253906', yahooTicker: 'XXSC.DE',  ter: 0.30, aumM: 2912, ytd: 3.14,  y2526: 19.14, y2425: 3.55,  tab: 'size' },
  { name: 'MSCI World (ref)',           isin: 'IE00BJ0KDQ92', yahooTicker: 'XDWD.DE',  ter: 0.12, aumM: 23029,ytd: 4.63,  y2526: 18.97, y2425: 7.08,  tab: 'size', group: 'ref' }, // *
  { name: 'Spain ETF (ref)',            isin: 'LU0592216393', yahooTicker: 'XBES.DE',  ter: 0.30, aumM: 436,  ytd: 4.18,  y2526: 35.66, y2425: 17.90, tab: 'size', group: 'ref' },
];

export const TABS: { id: Tab; label: string }[] = [
  { id: 'factors',       label: 'Factores' },
  { id: 'world-sectors', label: 'Sectores Globales' },
  { id: 'eu-sectors',    label: 'Sectores Europa' },
  { id: 'thematic',      label: 'Temáticos' },
  { id: 'size',          label: 'Tamaño / Ref' },
];

export function getSignal(ytd: number | null): { label: string; cls: string } {
  if (ytd === null) return { label: 'NUEVO', cls: 'new' };
  if (ytd >= 10)  return { label: 'HOT',     cls: 'hot' };
  if (ytd >= 3)   return { label: 'FUERTE',  cls: 'strong' };
  if (ytd >= -3)  return { label: 'NEUTRAL', cls: 'neutral' };
  return             { label: 'DÉBIL',   cls: 'weak' };
}
