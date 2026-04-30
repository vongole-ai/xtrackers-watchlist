# Xtrackers Watchlist

Dashboard de seguimiento para ETFs Xtrackers con precios en tiempo real de Yahoo Finance (Xetra/IBIS2).

## Stack

- **Next.js 14** (App Router)
- **Yahoo Finance** API no oficial — sin API key necesaria
- **Vercel** para deployment (cero configuración)

## Datos incluidos

40 ETFs organizados en 5 pestañas:
- Factores (Value, Momentum, Quality, Min Vol, Equal Weight…)
- Sectores Globales (MSCI World × 10 sectores GICS)
- Sectores Europa (MSCI Europe Screened × 8 sectores)
- Temáticos (AI, Mobility, Infrastructure, Defence, Clean Energy…)
- Tamaño / Referencia (Russell 2000, EU Small Cap, MSCI World…)

Cada ETF muestra: precio en vivo, cambio diario %, YTD histórico, año fiscal 3/25–3/26, AUM, TER, señal automática (HOT/FUERTE/NEUTRAL/DÉBIL).

## Inicio rápido

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy en Vercel (recomendado)

**Opción A — CLI:**
```bash
npm i -g vercel
vercel --prod
```

**Opción B — GitHub:**
1. Sube este repositorio a GitHub
2. Ve a https://vercel.com/new
3. Importa el repositorio
4. Click "Deploy" — zero config necesario

## Actualizar tickers de Yahoo Finance

Si un ETF aparece con precio "—", el ticker de Yahoo Finance puede ser incorrecto.

1. Abre `lib/watchlist.ts`
2. Busca el ISIN del ETF problemático
3. Ve a https://finance.yahoo.com y busca el ISIN
4. Encuentra el ticker con sufijo `.DE` (Xetra)
5. Actualiza el campo `yahooTicker` en el array `WATCHLIST`

Los tickers marcados con `*` en el código son de alta confianza.
Los marcados con `‡` son estimaciones del patrón de naming de Xtrackers.

## Frecuencia de actualización

- Los precios se refrescan automáticamente cada **5 minutos**
- La caché del servidor dura **5 minutos** (CDN Vercel)
- El botón ↻ fuerza un refresco inmediato del cliente

## Notas fiscales y legales

Este dashboard es solo para seguimiento personal. No constituye asesoramiento financiero profesional.
Los ETFs son productos UCITS de acumulación listados en Xetra (Deutsche Börse).
