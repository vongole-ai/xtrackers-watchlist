'use client';

import { useEffect, useState, useCallback } from 'react';
import { WATCHLIST, TABS, getSignal, type Tab, type ETF } from '@/lib/watchlist';

type QuoteData = {
  price: number | null;
  change: number | null;
  changeAbs: number | null;
  currency: string | null;
  prevClose: number | null;
  dayHigh: number | null;
  dayLow: number | null;
};

type SortKey = 'name' | 'change' | 'ytd' | 'y2526' | 'aumM';
type SortDir = 'asc' | 'desc';

function fmt(n: number | null | undefined, decimals = 2): string {
  if (n == null) return '—';
  const s = Math.abs(n).toFixed(decimals);
  return (n < 0 ? '−' : '+') + s + '%';
}

function fmtPrice(n: number | null, currency: string | null): string {
  if (n == null) return '—';
  return n.toFixed(2) + ' ' + (currency ?? '');
}

function fmtAum(n: number): string {
  if (n >= 1000) return '€' + (n / 1000).toFixed(1) + 'B';
  return '€' + n.toFixed(0) + 'M';
}

function ChangeCell({ val }: { val: number | null }) {
  if (val == null) return <td className="r mono muted">—</td>;
  const cls = val > 0 ? 'pos' : val < 0 ? 'neg' : 'muted';
  return <td className={`r mono ${cls}`}>{fmt(val)}</td>;
}

function SignalBadge({ ytd }: { ytd: number | null }) {
  const { label, cls } = getSignal(ytd);
  return <span className={`badge badge-${cls}`}>{label}</span>;
}

type SortState = { key: SortKey; dir: SortDir };

function sortETFs(list: ETF[], quotes: Record<string, QuoteData>, sort: SortState) {
  return [...list].sort((a, b) => {
    let va: number | null = null;
    let vb: number | null = null;

    if (sort.key === 'name') {
      const r = a.name.localeCompare(b.name);
      return sort.dir === 'asc' ? r : -r;
    } else if (sort.key === 'change') {
      va = quotes[a.yahooTicker]?.change ?? null;
      vb = quotes[b.yahooTicker]?.change ?? null;
    } else if (sort.key === 'ytd') {
      va = a.ytd;
      vb = b.ytd;
    } else if (sort.key === 'y2526') {
      va = a.y2526;
      vb = b.y2526;
    } else if (sort.key === 'aumM') {
      va = a.aumM;
      vb = b.aumM;
    }

    if (va == null && vb == null) return 0;
    if (va == null) return 1;
    if (vb == null) return -1;
    return sort.dir === 'asc' ? va - vb : vb - va;
  });
}

function Th({
  label,
  sortKey,
  current,
  onSort,
  right,
}: {
  label: string;
  sortKey?: SortKey;
  current: SortState;
  onSort: (k: SortKey) => void;
  right?: boolean;
}) {
  const active = sortKey && current.key === sortKey;
  const arrow = active ? (current.dir === 'asc' ? ' ↑' : ' ↓') : '';
  return (
    <th
      className={right ? 'r' : ''}
      style={{ cursor: sortKey ? 'pointer' : 'default', userSelect: 'none' }}
      onClick={() => sortKey && onSort(sortKey)}
    >
      {label}
      {sortKey && <span style={{ opacity: active ? 1 : 0.3 }}>{arrow || ' ↕'}</span>}
    </th>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('factors');
  const [quotes, setQuotes] = useState<Record<string, QuoteData>>({});
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiOk, setApiOk] = useState(true);
  const [sort, setSort] = useState<SortState>({ key: 'ytd', dir: 'desc' });

  const fetchQuotes = useCallback(async () => {
    try {
      const res = await fetch('/api/quotes');
      const data = await res.json();
      setQuotes(data.quotes ?? {});
      setFetchedAt(new Date(data.fetchedAt));
      setApiOk(data.ok);
    } catch {
      setApiOk(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
    const interval = setInterval(fetchQuotes, 5 * 60 * 1000); // refresh every 5 min
    return () => clearInterval(interval);
  }, [fetchQuotes]);

  function handleSort(key: SortKey) {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === 'desc' ? 'asc' : 'desc' }
        : { key, dir: 'desc' }
    );
  }

  const tabData = WATCHLIST.filter((e) => e.tab === activeTab);
  const sorted = sortETFs(tabData, quotes, sort);

  const liveCount = Object.keys(quotes).length;
  const minutesAgo = fetchedAt
    ? Math.floor((Date.now() - fetchedAt.getTime()) / 60000)
    : null;

  return (
    <div className="root">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="header-left">
            <span className="logo">XTRACKERS</span>
            <span className="logo-sub">WATCHLIST</span>
          </div>
          <div className="header-right">
            {!apiOk && (
              <span className="badge-warn">Yahoo Finance no disponible — mostrando datos históricos</span>
            )}
            {apiOk && liveCount > 0 && (
              <>
                <span className="live-dot" />
                <span className="live-label">
                  {liveCount} precios en vivo
                </span>
              </>
            )}
            {fetchedAt && (
              <span className="updated">
                Actualizado {minutesAgo === 0 ? 'ahora' : `hace ${minutesAgo}m`}
              </span>
            )}
            <button className="refresh-btn" onClick={fetchQuotes} title="Actualizar">
              ↻
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Table */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <Th label="Nombre" sortKey="name" current={sort} onSort={handleSort} />
              <th>ISIN</th>
              <th className="r">TER</th>
              <Th label="AUM" sortKey="aumM" current={sort} onSort={handleSort} right />
              <th className="r">Precio</th>
              <Th label="Hoy" sortKey="change" current={sort} onSort={handleSort} right />
              <Th label="YTD hist." sortKey="ytd" current={sort} onSort={handleSort} right />
              <Th label="3/25–3/26" sortKey="y2526" current={sort} onSort={handleSort} right />
              <th className="r">3/24–3/25</th>
              <th className="r">Señal</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="skeleton-row">
                    {Array.from({ length: 10 }).map((__, j) => (
                      <td key={j}><span className="skeleton" /></td>
                    ))}
                  </tr>
                ))
              : sorted.map((etf) => {
                  const q = quotes[etf.yahooTicker];
                  const isRef = etf.group === 'ref';
                  return (
                    <tr key={etf.isin} className={isRef ? 'row-ref' : ''}>
                      <td className="name-cell">
                        <span className="etf-name">{etf.name}</span>
                        {isRef && <span className="ref-tag">ref</span>}
                      </td>
                      <td className="isin-cell mono">{etf.isin}</td>
                      <td className="r mono muted">{etf.ter.toFixed(2)}%</td>
                      <td className="r mono">{fmtAum(etf.aumM)}</td>
                      <td className="r mono">
                        {q ? fmtPrice(q.price, q.currency) : <span className="muted">—</span>}
                      </td>
                      <ChangeCell val={q?.change ?? null} />
                      <ChangeCell val={etf.ytd} />
                      <ChangeCell val={etf.y2526} />
                      <ChangeCell val={etf.y2425} />
                      <td className="r">
                        <SignalBadge ytd={etf.ytd} />
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {/* Footer note */}
      <footer className="footer">
        <p>Precios de Yahoo Finance vía Xetra (IBIS2) · Datos históricos de Xtrackers (a 28 abr 2026) · Actualización automática cada 5 minutos</p>
        <p style={{ marginTop: 4, color: '#94A3B8' }}>⚠️ Esto no es asesoramiento financiero profesional. Solo para seguimiento e información personal.</p>
      </footer>
    </div>
  );
}
