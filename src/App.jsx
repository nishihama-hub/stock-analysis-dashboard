import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar, Cell, AreaChart, Area,
  ComposedChart, Legend, ReferenceLine
} from "recharts";
import {
  TrendingUp, TrendingDown, DollarSign, BarChart3, Activity,
  Newspaper, Target, AlertTriangle, ChevronRight, Building2,
  Globe, Users, Zap, ArrowUpRight, ArrowDownRight, Clock, Calendar
} from "lucide-react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const STOCK = {
  name: "Accenture plc",
  ticker: "ACN",
  exchange: "NYSE",
  sector: "Information Technology",
  industry: "IT Services & Consulting",
  hq: "Dublin, Ireland",
  employees: "~799,000",
  price: 191.50,
  change: -4.45,
  changePct: -2.21,
  prevClose: 196.73,
  high52w: 361.62,
  low52w: 188.73,
  marketCap: 119.3,
  avgVolume: "2.84M",
  beta: 1.28,
  nextEarnings: "2026-03-19",
  dividend: 6.52,
  dividendYield: 3.40,
};

const FUNDAMENTALS = {
  pe: 20.19,
  forwardPe: 17.72,
  peg: 1.94,
  pb: 5.46,
  ps: 2.38,
  evEbitda: 11.26,
  roe: 25.51,
  roa: 12.8,
  roic: 18.38,
  netMargin: 10.76,
  opMargin: 15.68,
  grossMargin: 31.91,
  debtEquity: 0.25,
  currentRatio: 1.42,
  interestCoverage: 45.94,
  fcfYield: 7.27,
};

const REVENUE_DATA = [
  { year: "FY21", revenue: 50.53, opIncome: 9.37, netIncome: 5.91 },
  { year: "FY22", revenue: 61.59, opIncome: 8.81, netIncome: 6.99 },
  { year: "FY23", revenue: 64.11, opIncome: 9.60, netIncome: 7.27 },
  { year: "FY24", revenue: 64.90, opIncome: 10.23, netIncome: 7.27 },
  { year: "FY25", revenue: 69.67, opIncome: 10.46, netIncome: 7.68 },
];

const QUARTERLY_DATA = [
  { q: "Q2'25", revenue: 16.47, eps: 3.27 },
  { q: "Q3'25", revenue: 17.69, eps: 3.13 },
  { q: "Q4'25", revenue: 18.74, eps: 3.28 },
  { q: "Q1'26", revenue: 18.70, eps: 3.94 },
];

const PRICE_HISTORY = [
  { month: "Mar'25", price: 340, ma50: 350, ma200: 345 },
  { month: "Apr'25", price: 330, ma50: 345, ma200: 343 },
  { month: "May'25", price: 355, ma50: 340, ma200: 340 },
  { month: "Jun'25", price: 345, ma50: 342, ma200: 338 },
  { month: "Jul'25", price: 360, ma50: 348, ma200: 336 },
  { month: "Aug'25", price: 350, ma50: 350, ma200: 335 },
  { month: "Sep'25", price: 340, ma50: 350, ma200: 333 },
  { month: "Oct'25", price: 360, ma50: 350, ma200: 333 },
  { month: "Nov'25", price: 355, ma50: 352, ma200: 334 },
  { month: "Dec'25", price: 285, ma50: 345, ma200: 330 },
  { month: "Jan'26", price: 265, ma50: 320, ma200: 310 },
  { month: "Feb'26", price: 191, ma50: 257, ma200: 252 },
];

const TECHNICALS = {
  rsi14: 30.56,
  macd: -11.96,
  macdSignal: "売りシグナル",
  ma5: 230.87,
  ma20: 256.79,
  ma50: 265.55,
  ma200: 252.37,
  bollingerUpper: 318.94,
  bollingerLower: 193.58,
  adx: 36.64,
  overallSignal: "Strong Sell",
  buySignals: 2,
  sellSignals: 9,
  neutralSignals: 6,
};

const NEWS = [
  { date: "2/26", title: "Accenture、Mistral AIと複数年の戦略的提携を発表", sentiment: "positive", source: "BusinessWire" },
  { date: "2/25", title: "Citi、ACNの目標株価を$266→$215に引き下げ（Neutral維持）", sentiment: "negative", source: "TipRanks" },
  { date: "2/24", title: "Verum Partners（インフラ管理企業）の買収に合意", sentiment: "positive", source: "BusinessWire" },
  { date: "2/19", title: "AI活用を昇進条件に - シニアスタッフへの方針発表", sentiment: "neutral", source: "FT" },
  { date: "2/17", title: "Wells Fargo、ACNをOverweightに格上げ（目標$275）", sentiment: "positive", source: "TipRanks" },
];

const ANALYST = {
  buy: 16,
  hold: 11,
  sell: 1,
  avgTarget: 296.42,
  highTarget: 392,
  lowTarget: 210,
  consensus: "Moderate Buy",
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const fmt = (n, d = 2) => typeof n === "number" ? n.toFixed(d) : n;
const fmtB = (n) => `$${fmt(n, 2)}B`;
const pctColor = (v) => v >= 0 ? "#10b981" : "#f43f5e";
const pctIcon = (v) => v >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ANIMATED NUMBER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function AnimNum({ value, prefix = "", suffix = "", decimals = 2 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1200;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    tick();
  }, [value]);
  return <span>{prefix}{fmt(display, decimals)}{suffix}</span>;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GAUGE COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Gauge({ value, max, label, color, zones }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4, letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
      <div style={{ position: "relative", height: 8, background: "#1e293b", borderRadius: 4, overflow: "hidden" }}>
        {zones && zones.map((z, i) => (
          <div key={i} style={{ position: "absolute", left: `${z.start}%`, width: `${z.end - z.start}%`, height: "100%", background: z.color, opacity: 0.2 }} />
        ))}
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 4, transition: "width 1.5s cubic-bezier(0.22,1,0.36,1)" }} />
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color, marginTop: 6, fontFamily: "'JetBrains Mono', monospace" }}>{fmt(value, value < 10 ? 2 : 1)}</div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// METRIC CARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function MetricCard({ label, value, sub, icon: Icon, color = "#38bdf8" }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      border: "1px solid #334155",
      borderRadius: 12,
      padding: "14px 16px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      transition: "border-color 0.2s",
    }}>
      {Icon && (
        <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={18} color={color} />
        </div>
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
        {sub && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TABS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TABS = [
  { id: "overview", label: "総合", icon: BarChart3 },
  { id: "fundamental", label: "ファンダメンタル", icon: Building2 },
  { id: "technical", label: "テクニカル", icon: Activity },
  { id: "news", label: "ニュース", icon: Newspaper },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function StockDashboard() {
  const [tab, setTab] = useState("overview");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const upside = ((ANALYST.avgTarget - STOCK.price) / STOCK.price * 100);
  const pos52 = ((STOCK.price - STOCK.low52w) / (STOCK.high52w - STOCK.low52w) * 100);

  const containerStyle = {
    fontFamily: "'Noto Sans JP', 'Segoe UI', system-ui, sans-serif",
    background: "linear-gradient(180deg, #020617 0%, #0f172a 50%, #020617 100%)",
    minHeight: "100vh",
    color: "#e2e8f0",
    padding: "0 0 40px",
    opacity: loaded ? 1 : 0,
    transition: "opacity 0.6s ease",
  };

  return (
    <div style={containerStyle}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Noto+Sans+JP:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* ── HEADER ── */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        borderBottom: "1px solid #1e293b",
        padding: "24px 28px 20px",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: "#f8fafc" }}>{STOCK.name}</span>
              <span style={{
                background: "#38bdf820",
                color: "#38bdf8",
                padding: "2px 10px",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'JetBrains Mono', monospace",
              }}>{STOCK.ticker}</span>
              <span style={{ fontSize: 12, color: "#64748b" }}>{STOCK.exchange}</span>
            </div>
            <div style={{ fontSize: 12, color: "#64748b", display: "flex", gap: 16, flexWrap: "wrap" }}>
              <span><Globe size={12} style={{ verticalAlign: -1, marginRight: 4 }} />{STOCK.hq}</span>
              <span><Building2 size={12} style={{ verticalAlign: -1, marginRight: 4 }} />{STOCK.sector}</span>
              <span><Users size={12} style={{ verticalAlign: -1, marginRight: 4 }} />{STOCK.employees}</span>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <span style={{ fontSize: 36, fontWeight: 700, color: "#f8fafc" }}>
                $<AnimNum value={STOCK.price} decimals={2} />
              </span>
            </div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              color: pctColor(STOCK.changePct),
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {pctIcon(STOCK.changePct)}
              {STOCK.change > 0 ? "+" : ""}{fmt(STOCK.change)} ({STOCK.changePct > 0 ? "+" : ""}{fmt(STOCK.changePct)}%)
            </div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
              <Clock size={10} style={{ verticalAlign: -1, marginRight: 3 }} />
              Feb 24, 2026 Close
            </div>
          </div>
        </div>

        {/* 52-week range bar */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b", marginBottom: 4 }}>
            <span>52週安値 ${fmt(STOCK.low52w)}</span>
            <span>52週高値 ${fmt(STOCK.high52w)}</span>
          </div>
          <div style={{ position: "relative", height: 6, background: "#1e293b", borderRadius: 3 }}>
            <div style={{
              position: "absolute",
              left: 0,
              height: "100%",
              width: `${pos52}%`,
              background: "linear-gradient(90deg, #f43f5e, #f59e0b, #10b981)",
              borderRadius: 3,
              transition: "width 1.5s cubic-bezier(0.22,1,0.36,1)",
            }} />
            <div style={{
              position: "absolute",
              left: `${pos52}%`,
              top: -4,
              width: 14,
              height: 14,
              background: "#f8fafc",
              borderRadius: "50%",
              border: "2px solid #0f172a",
              transform: "translateX(-50%)",
              transition: "left 1.5s cubic-bezier(0.22,1,0.36,1)",
            }} />
          </div>
        </div>
      </div>

      {/* ── TAB NAV ── */}
      <div style={{
        display: "flex",
        gap: 0,
        borderBottom: "1px solid #1e293b",
        background: "#0f172a",
        overflowX: "auto",
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "12px 20px",
              background: "none",
              border: "none",
              borderBottom: tab === t.id ? "2px solid #38bdf8" : "2px solid transparent",
              color: tab === t.id ? "#38bdf8" : "#64748b",
              fontSize: 13,
              fontWeight: tab === t.id ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: "20px 24px", maxWidth: 1100, margin: "0 auto" }}>

        {/* ══════════ OVERVIEW TAB ══════════ */}
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Key Metrics Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
              <MetricCard label="時価総額" value={`$${fmt(STOCK.marketCap, 1)}B`} icon={DollarSign} color="#38bdf8" />
              <MetricCard label="PER (TTM)" value={fmt(FUNDAMENTALS.pe)} sub={`Fwd: ${fmt(FUNDAMENTALS.forwardPe)}`} icon={BarChart3} color="#a78bfa" />
              <MetricCard label="ROE" value={`${fmt(FUNDAMENTALS.roe)}%`} icon={TrendingUp} color="#10b981" />
              <MetricCard label="配当利回り" value={`${fmt(STOCK.dividendYield)}%`} sub={`$${fmt(STOCK.dividend)}/年`} icon={DollarSign} color="#f59e0b" />
            </div>

            {/* Chart + Analyst side by side */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
              {/* Price Chart */}
              <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: "18px 16px" }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#94a3b8" }}>株価推移（12ヶ月）& 移動平均線</div>
                <ResponsiveContainer width="100%" height={240}>
                  <ComposedChart data={PRICE_HISTORY}>
                    <defs>
                      <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#1e293b" }} />
                    <YAxis domain={[150, 400]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#1e293b" }} />
                    <Tooltip
                      contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: "#94a3b8" }}
                    />
                    <Area type="monotone" dataKey="price" fill="url(#priceGrad)" stroke="#f43f5e" strokeWidth={2} name="株価" dot={false} />
                    <Line type="monotone" dataKey="ma50" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="50日MA" />
                    <Line type="monotone" dataKey="ma200" stroke="#38bdf8" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="200日MA" />
                    <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Analyst Rating */}
              <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: "18px 16px" }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#94a3b8" }}>アナリスト評価</div>
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <div style={{
                    display: "inline-block",
                    background: "#10b98120",
                    border: "1px solid #10b98140",
                    borderRadius: 10,
                    padding: "8px 20px",
                  }}>
                    <div style={{ fontSize: 11, color: "#10b981", textTransform: "uppercase", letterSpacing: 1 }}>Consensus</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#10b981" }}>{ANALYST.consensus}</div>
                  </div>
                </div>

                {/* Rating bar */}
                <div style={{ display: "flex", height: 24, borderRadius: 6, overflow: "hidden", marginBottom: 12 }}>
                  <div style={{ width: `${ANALYST.buy / 28 * 100}%`, background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>{ANALYST.buy}</div>
                  <div style={{ width: `${ANALYST.hold / 28 * 100}%`, background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>{ANALYST.hold}</div>
                  <div style={{ width: `${ANALYST.sell / 28 * 100}%`, background: "#f43f5e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>{ANALYST.sell}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b", marginBottom: 20 }}>
                  <span>Buy {ANALYST.buy}</span><span>Hold {ANALYST.hold}</span><span>Sell {ANALYST.sell}</span>
                </div>

                {/* Target Price */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>目標株価レンジ</div>
                  <div style={{ position: "relative", height: 8, background: "#1e293b", borderRadius: 4 }}>
                    <div style={{
                      position: "absolute",
                      left: `${(ANALYST.lowTarget - 150) / (450 - 150) * 100}%`,
                      width: `${(ANALYST.highTarget - ANALYST.lowTarget) / (450 - 150) * 100}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #f59e0b, #10b981)",
                      borderRadius: 4,
                      opacity: 0.6,
                    }} />
                    <div style={{
                      position: "absolute",
                      left: `${(STOCK.price - 150) / (450 - 150) * 100}%`,
                      top: -3,
                      width: 14,
                      height: 14,
                      background: "#f43f5e",
                      borderRadius: "50%",
                      border: "2px solid #0f172a",
                      transform: "translateX(-50%)",
                    }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
                    <span style={{ color: "#f59e0b" }}>${ANALYST.lowTarget}</span>
                    <span style={{ color: "#10b981", fontWeight: 700 }}>${fmt(ANALYST.avgTarget)}</span>
                    <span style={{ color: "#10b981" }}>${ANALYST.highTarget}</span>
                  </div>
                </div>
                <div style={{
                  textAlign: "center",
                  marginTop: 12,
                  padding: "8px 0",
                  background: "#10b98110",
                  borderRadius: 8,
                  border: "1px solid #10b98130",
                }}>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>潜在上昇率 </span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "#10b981", fontFamily: "'JetBrains Mono', monospace" }}>
                    +{fmt(upside, 1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Revenue & Earnings chart */}
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: "18px 16px" }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#94a3b8" }}>業績推移（$B）</div>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={REVENUE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={{ stroke: "#1e293b" }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#1e293b" }} />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="revenue" fill="#38bdf8" radius={[4, 4, 0, 0]} name="売上高" barSize={36} />
                  <Line type="monotone" dataKey="opIncome" stroke="#f59e0b" strokeWidth={2} name="営業利益" dot={{ r: 4, fill: "#f59e0b" }} />
                  <Line type="monotone" dataKey="netIncome" stroke="#10b981" strokeWidth={2} name="純利益" dot={{ r: 4, fill: "#10b981" }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Summary */}
            <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", border: "1px solid #334155", borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: "#f8fafc", display: "flex", alignItems: "center", gap: 8 }}>
                <Target size={18} color="#38bdf8" />
                総合サマリー
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, fontSize: 13 }}>
                <div>
                  <div style={{ color: "#10b981", fontWeight: 600, marginBottom: 6 }}>✦ 強み</div>
                  <div style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                    安定した売上成長（FY25: +7.4%）。AI関連ブッキングが急拡大（$2.2B、前四半期比+22%）。ROE 25.5%と高い資本効率。低い負債比率（D/E: 0.25）。
                  </div>
                </div>
                <div>
                  <div style={{ color: "#f43f5e", fontWeight: 600, marginBottom: 6 }}>✦ リスク</div>
                  <div style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                    株価が52週高値から約47%下落。全移動平均線を下回り、テクニカルはStrong Sell。AIがIT企業のビジネスモデルを侵食するリスク。景気後退時のIT予算削減リスク。
                  </div>
                </div>
                <div>
                  <div style={{ color: "#f59e0b", fontWeight: 600, marginBottom: 6 }}>✦ 注目ポイント</div>
                  <div style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                    次回決算（3/19）でFY26 Q2の数値に注目。Mistral AI/OpenAI等との提携戦略の成果。RSI 30台で売られすぎ圏に接近。アナリスト目標株価との大きな乖離。
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ FUNDAMENTAL TAB ══════════ */}
        {tab === "fundamental" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Valuation */}
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: "#94a3b8" }}>バリュエーション</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16 }}>
                {[
                  { label: "PER (TTM)", val: FUNDAMENTALS.pe, ind: "業界平均 27.7" },
                  { label: "予想PER", val: FUNDAMENTALS.forwardPe, ind: "" },
                  { label: "PEG", val: FUNDAMENTALS.peg, ind: "" },
                  { label: "PBR", val: FUNDAMENTALS.pb, ind: "" },
                  { label: "PSR", val: FUNDAMENTALS.ps, ind: "" },
                  { label: "EV/EBITDA", val: FUNDAMENTALS.evEbitda, ind: "" },
                ].map((m, i) => (
                  <div key={i} style={{ textAlign: "center", padding: 12, background: "#1e293b", borderRadius: 10 }}>
                    <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{m.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#f8fafc", fontFamily: "'JetBrains Mono', monospace" }}>{fmt(m.val)}</div>
                    {m.ind && <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{m.ind}</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Profitability */}
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: "#94a3b8" }}>収益性</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                <Gauge value={FUNDAMENTALS.grossMargin} max={60} label="粗利益率" color="#38bdf8" />
                <Gauge value={FUNDAMENTALS.opMargin} max={30} label="営業利益率" color="#a78bfa" />
                <Gauge value={FUNDAMENTALS.netMargin} max={20} label="純利益率" color="#10b981" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginTop: 20 }}>
                <Gauge value={FUNDAMENTALS.roe} max={40} label="ROE" color="#f59e0b" />
                <Gauge value={FUNDAMENTALS.roa} max={20} label="ROA" color="#ec4899" />
                <Gauge value={FUNDAMENTALS.roic} max={25} label="ROIC" color="#14b8a6" />
              </div>
            </div>

            {/* Financial Health */}
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: "#94a3b8" }}>財務健全性</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                <MetricCard label="D/Eレシオ" value={fmt(FUNDAMENTALS.debtEquity)} sub="低水準 ◎" icon={Building2} color="#10b981" />
                <MetricCard label="流動比率" value={fmt(FUNDAMENTALS.currentRatio)} sub=">1.0 健全" icon={Activity} color="#38bdf8" />
                <MetricCard label="インタレストカバレッジ" value={fmt(FUNDAMENTALS.interestCoverage, 1)} sub="非常に高い ◎" icon={Zap} color="#f59e0b" />
                <MetricCard label="FCF利回り" value={`${fmt(FUNDAMENTALS.fcfYield)}%`} icon={DollarSign} color="#a78bfa" />
              </div>
            </div>

            {/* Quarterly */}
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: "#94a3b8" }}>四半期業績</div>
              <ResponsiveContainer width="100%" height={200}>
                <ComposedChart data={QUARTERLY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="q" tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }} />
                  <Bar yAxisId="left" dataKey="revenue" fill="#38bdf8" radius={[4, 4, 0, 0]} name="売上高($B)" barSize={40} />
                  <Line yAxisId="right" type="monotone" dataKey="eps" stroke="#f59e0b" strokeWidth={2.5} name="EPS($)" dot={{ r: 5, fill: "#f59e0b" }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </ComposedChart>
              </ResponsiveContainer>
              <div style={{ textAlign: "center", marginTop: 8, fontSize: 12, color: "#64748b" }}>
                <Calendar size={12} style={{ verticalAlign: -1, marginRight: 4 }} />
                次回決算発表: 2026年3月19日 | FY26ガイダンス EPS: $13.52〜$13.90
              </div>
            </div>
          </div>
        )}

        {/* ══════════ TECHNICAL TAB ══════════ */}
        {tab === "technical" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Overall Signal */}
            <div style={{
              background: "linear-gradient(135deg, #f43f5e15 0%, #0f172a 100%)",
              border: "1px solid #f43f5e40",
              borderRadius: 12,
              padding: 20,
              textAlign: "center",
            }}>
              <div style={{ fontSize: 12, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>テクニカル総合シグナル</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#f43f5e" }}>{TECHNICALS.overallSignal}</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 10, fontSize: 13 }}>
                <span style={{ color: "#10b981" }}>Buy: {TECHNICALS.buySignals}</span>
                <span style={{ color: "#64748b" }}>Neutral: {TECHNICALS.neutralSignals}</span>
                <span style={{ color: "#f43f5e" }}>Sell: {TECHNICALS.sellSignals}</span>
              </div>
            </div>

            {/* Price vs MAs */}
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: "#94a3b8" }}>移動平均線との乖離</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                {[
                  { label: "5日MA", val: TECHNICALS.ma5 },
                  { label: "20日MA", val: TECHNICALS.ma20 },
                  { label: "50日MA", val: TECHNICALS.ma50 },
                  { label: "200日MA", val: TECHNICALS.ma200 },
                ].map((m, i) => {
                  const dev = ((STOCK.price - m.val) / m.val * 100);
                  return (
                    <div key={i} style={{ background: "#1e293b", borderRadius: 10, padding: 14 }}>
                      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>{m.label}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 18, fontWeight: 700, color: "#f8fafc", fontFamily: "'JetBrains Mono', monospace" }}>
                          ${fmt(m.val)}
                        </span>
                        <span style={{
                          color: pctColor(dev),
                          fontSize: 13,
                          fontWeight: 600,
                          fontFamily: "'JetBrains Mono', monospace",
                          padding: "2px 8px",
                          background: `${pctColor(dev)}15`,
                          borderRadius: 6,
                        }}>
                          {dev > 0 ? "+" : ""}{fmt(dev, 1)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RSI & MACD */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "#94a3b8" }}>RSI (14)</div>
                <Gauge
                  value={TECHNICALS.rsi14}
                  max={100}
                  label=""
                  color={TECHNICALS.rsi14 < 30 ? "#f43f5e" : TECHNICALS.rsi14 > 70 ? "#10b981" : "#f59e0b"}
                  zones={[
                    { start: 0, end: 30, color: "#f43f5e" },
                    { start: 30, end: 70, color: "#f59e0b" },
                    { start: 70, end: 100, color: "#10b981" },
                  ]}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#475569", marginTop: 8 }}>
                  <span>売られすぎ (＜30)</span>
                  <span>中立</span>
                  <span>買われすぎ (＞70)</span>
                </div>
                <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "#f59e0b", fontWeight: 500 }}>
                  売られすぎ圏に接近 — 反発の兆候を注視
                </div>
              </div>

              <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "#94a3b8" }}>MACD</div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 36, fontWeight: 700, color: "#f43f5e", fontFamily: "'JetBrains Mono', monospace" }}>
                    {fmt(TECHNICALS.macd)}
                  </div>
                  <div style={{
                    display: "inline-block",
                    marginTop: 8,
                    padding: "4px 14px",
                    background: "#f43f5e20",
                    border: "1px solid #f43f5e40",
                    borderRadius: 6,
                    color: "#f43f5e",
                    fontSize: 12,
                    fontWeight: 600,
                  }}>
                    {TECHNICALS.macdSignal}
                  </div>
                </div>
                <div style={{ marginTop: 16, fontSize: 12, color: "#64748b", lineHeight: 1.7 }}>
                  MACDラインがシグナルラインを大幅に下回り、下降トレンド継続を示唆。ヒストグラムのマイナス幅縮小に注目。
                </div>
              </div>
            </div>

            {/* Bollinger Bands */}
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "#94a3b8" }}>ボリンジャーバンド (25)</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ position: "relative", height: 24, background: "#1e293b", borderRadius: 12 }}>
                    <div style={{
                      position: "absolute",
                      left: `${((TECHNICALS.bollingerLower - 150) / (400 - 150)) * 100}%`,
                      width: `${((TECHNICALS.bollingerUpper - TECHNICALS.bollingerLower) / (400 - 150)) * 100}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #38bdf820, #a78bfa30, #38bdf820)",
                      borderRadius: 12,
                    }} />
                    <div style={{
                      position: "absolute",
                      left: `${((STOCK.price - 150) / (400 - 150)) * 100}%`,
                      top: 2,
                      width: 20,
                      height: 20,
                      background: "#f43f5e",
                      borderRadius: "50%",
                      border: "2px solid #0f172a",
                      transform: "translateX(-50%)",
                    }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
                    <span style={{ color: "#38bdf8" }}>下限: ${fmt(TECHNICALS.bollingerLower)}</span>
                    <span style={{ color: "#f43f5e" }}>現在値: ${fmt(STOCK.price)}</span>
                    <span style={{ color: "#38bdf8" }}>上限: ${fmt(TECHNICALS.bollingerUpper)}</span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: "#64748b" }}>
                株価がボリンジャーバンド下限付近に位置。バンド幅が拡大しておりボラティリティの増大を示す。
              </div>
            </div>

            {/* ADX */}
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#94a3b8" }}>ADX（トレンド強度）</div>
              <Gauge
                value={TECHNICALS.adx}
                max={60}
                label=""
                color={TECHNICALS.adx > 25 ? "#f59e0b" : "#64748b"}
                zones={[
                  { start: 0, end: 42, color: "#64748b" },
                  { start: 42, end: 75, color: "#f59e0b" },
                  { start: 75, end: 100, color: "#f43f5e" },
                ]}
              />
              <div style={{ textAlign: "center", marginTop: 8, fontSize: 12, color: "#f59e0b" }}>
                ADX 36.6 — 明確なトレンドが存在（下降トレンド）
              </div>
            </div>
          </div>
        )}

        {/* ══════════ NEWS TAB ══════════ */}
        {tab === "news" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Sentiment Overview */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div style={{ background: "#10b98115", border: "1px solid #10b98130", borderRadius: 12, padding: 16, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#10b981", textTransform: "uppercase", letterSpacing: 1 }}>ポジティブ</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#10b981", fontFamily: "'JetBrains Mono', monospace" }}>3</div>
              </div>
              <div style={{ background: "#64748b15", border: "1px solid #64748b30", borderRadius: 12, padding: 16, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>ニュートラル</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>1</div>
              </div>
              <div style={{ background: "#f43f5e15", border: "1px solid #f43f5e30", borderRadius: 12, padding: 16, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#f43f5e", textTransform: "uppercase", letterSpacing: 1 }}>ネガティブ</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#f43f5e", fontFamily: "'JetBrains Mono', monospace" }}>1</div>
              </div>
            </div>

            {/* News List */}
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: "#94a3b8" }}>最新ニュース</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {NEWS.map((n, i) => (
                  <div key={i} style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "14px 0",
                    borderBottom: i < NEWS.length - 1 ? "1px solid #1e293b" : "none",
                  }}>
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      marginTop: 6,
                      flexShrink: 0,
                      background: n.sentiment === "positive" ? "#10b981" : n.sentiment === "negative" ? "#f43f5e" : "#f59e0b",
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, color: "#e2e8f0", fontWeight: 500, lineHeight: 1.5 }}>{n.title}</div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                        {n.date} · {n.source}
                      </div>
                    </div>
                    <ChevronRight size={16} color="#475569" style={{ flexShrink: 0, marginTop: 4 }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Key Themes */}
            <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", border: "1px solid #334155", borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, color: "#f8fafc" }}>
                <Zap size={16} style={{ verticalAlign: -2, marginRight: 6, color: "#f59e0b" }} />
                主要テーマ
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ background: "#1e293b", borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#38bdf8", marginBottom: 6 }}>🤖 AI戦略の本格化</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>
                    Mistral AI・OpenAIとの提携、AI活用を昇進条件に設定するなど、全社的にAIへシフト。AI関連ブッキングは$2.2Bに到達。
                  </div>
                </div>
                <div style={{ background: "#1e293b", borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#f59e0b", marginBottom: 6 }}>📉 株価の急落</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>
                    AIツール（特にAnthropicのプラグイン）がITサービス企業のビジネスモデルを脅かすとの懸念から、セクター全体で売りが加速。52週高値から約47%下落。
                  </div>
                </div>
                <div style={{ background: "#1e293b", borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#10b981", marginBottom: 6 }}>🏢 積極的なM&A</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>
                    Faculty、Verum Partners、Cabel Industryなど複数の買収を実施。AI・インフラ分野の能力を強化。
                  </div>
                </div>
                <div style={{ background: "#1e293b", borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#a78bfa", marginBottom: 6 }}>📊 堅調な業績</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>
                    Q1 FY26は売上・EPSともにアナリスト予想を上回る。FY26ガイダンスもEPS $13.52〜$13.90と強気。ただし成長鈍化の懸念も。
                  </div>
                </div>
              </div>
            </div>

            {/* Short Interest */}
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#94a3b8" }}>ショートインタレスト</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, textAlign: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>空売り株数</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#f43f5e", fontFamily: "'JetBrains Mono', monospace" }}>15.2M</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>浮動株比率</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#f59e0b", fontFamily: "'JetBrains Mono', monospace" }}>2.5%</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>カバー日数</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#f8fafc", fontFamily: "'JetBrains Mono', monospace" }}>2.3日</div>
                </div>
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: "#f59e0b", textAlign: "center" }}>
                ⚠ 2月にショートインタレストが約24.5%増加 — 弱気ポジションの拡大
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── FOOTER / DISCLAIMER ── */}
      <div style={{
        margin: "24px 24px 0",
        padding: "16px 20px",
        background: "#0f172a",
        border: "1px solid #f59e0b30",
        borderRadius: 10,
        fontSize: 11,
        color: "#64748b",
        lineHeight: 1.6,
        maxWidth: 1100,
        marginLeft: "auto",
        marginRight: "auto",
      }}>
        <AlertTriangle size={13} style={{ verticalAlign: -2, marginRight: 6, color: "#f59e0b" }} />
        <strong style={{ color: "#f59e0b" }}>免責事項:</strong> 本ダッシュボードは情報提供のみを目的としており、投資助言ではありません。投資判断はご自身の責任で行ってください。データはWeb検索（2026年2月28日時点）に基づくものであり、正確性・即時性を保証するものではありません。株式投資にはリスクが伴い、元本を失う可能性があります。
      </div>
    </div>
  );
}
