import React, { useEffect, useState } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';
import { CheckCircle2, LockKeyhole } from 'lucide-react';
import { INGREDIENT_WASTE, MONTHLY_FINANCIALS, WEEKLY_SALES } from '../data/mockData';
import { formatPeso } from '../utils/currency';

const stages = [
  ['1. Business understanding', 'Reduce food waste and prevent ingredient stockouts.'],
  ['2. Data understanding', 'Extract and profile 5+ years of Loyverse POS CSV sales and inventory data.'],
  ['3. Data preparation', 'Clean duplicates and missing values, engineer calendar features, apply bill of materials, and load PostgreSQL facts.'],
  ['4. Modeling', 'Use SES, SARIMA, Holt-Winters, and ML Regression forecasts with PuLP replenishment optimization.'],
  ['5. Evaluation', 'Use holdout validation with WMAPE and MASE, then simulate waste reduction and cost savings.'],
  ['6. Deployment', 'Deliver Power BI alerts for spoilage, excess capital, stockout risk, and supplier purchasing.'],
];

interface EmbedResponse { reportId: string; embedUrl: string; embedToken: string; }

export const AnalyticsPage: React.FC = () => {
  const [embed, setEmbed] = useState<EmbedResponse | null>(null);
  useEffect(() => { fetch('/api/get-powerbi-embed-token').then(response => response.ok ? response.json() : null).then(data => data?.reportId && setEmbed(data)).catch(() => undefined); }, []);
  return <div className="max-w-7xl mx-auto space-y-6">
    <header><p className="text-sm font-semibold text-blue-800">Performance analytics</p><h1 className="text-3xl font-extrabold tracking-tight text-slate-950 mt-1">Analytics Overview</h1><p className="text-sm text-slate-500 mt-1">Deep dive into revenue, waste, performance, and the DSS decision pipeline.</p></header>
    <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      <Card title="Revenue vs profit" subtitle="Monthly performance tracking"><ResponsiveContainer width="100%" height="100%"><LineChart data={MONTHLY_FINANCIALS}><CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} tickFormatter={v => `₱${v / 1000}k`} /><Tooltip formatter={(v: number) => [formatPeso(v, 0)]} /><Line dataKey="revenue" stroke="#1E3A8A" strokeWidth={3} name="Revenue" /><Line dataKey="profit" stroke="#DC2626" strokeWidth={3} name="Profit" /></LineChart></ResponsiveContainer></Card>
      <Card title="Waste analysis by ingredient" subtitle="Kilograms wasted over last 30 days"><ResponsiveContainer width="100%" height="100%"><BarChart data={INGREDIENT_WASTE.slice(0, 5)}><CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="ingredient" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} /><YAxis axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="wasteKg" fill="#DC2626" radius={[4, 4, 0, 0]} name="Waste (kg)" /></BarChart></ResponsiveContainer></Card>
      <Card title="Order volume vs wait time" subtitle="Correlation analysis"><ResponsiveContainer width="100%" height="100%"><ScatterChart><CartesianGrid stroke="#e2e8f0" /><XAxis type="number" dataKey="orders" name="Orders" /><YAxis type="number" dataKey="sales" name="Revenue" tickFormatter={v => `₱${v / 1000}k`} /><Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(v: number) => [formatPeso(v, 0)]} /><Scatter data={WEEKLY_SALES} fill="#1E3A8A" /></ScatterChart></ResponsiveContainer></Card>
    </section>
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between mb-4"><div><h2 className="font-bold text-slate-950">CRISP-DM + DSR implementation</h2><p className="text-xs text-slate-500 mt-1">The methodology is embedded here instead of living on a separate page.</p></div><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">{stages.map(([title, detail]) => <div key={title} className="rounded-lg bg-slate-50 p-3"><p className="text-xs font-bold text-blue-900">{title}</p><p className="text-xs leading-relaxed text-slate-600 mt-1">{detail}</p></div>)}</div></section>
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-5"><div className="rounded-xl border border-blue-100 bg-blue-50/60 p-5"><p className="text-xs font-bold uppercase tracking-wide text-blue-800">Analytics engine</p><p className="text-sm text-slate-700 mt-2">Predictive models use SES for stable demand, SARIMA for weekly seasonal perishables, Holt-Winters for 2-4 week procurement, and ML Regression for holiday and event effects. WMAPE and MASE avoid zero-demand MAPE errors.</p><p className="text-sm text-slate-700 mt-2">PuLP minimizes over-ordering waste and under-ordering lost sales within budget, storage capacity, supplier lead time, and shelf-life constraints.</p></div><div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><LockKeyhole className="w-4 h-4 text-emerald-600" /><h2 className="font-bold text-slate-950">Power BI deployment</h2></div>{embed ? <div className="h-48 mt-3 rounded-lg overflow-hidden"><PowerBIEmbed embedConfig={{ type: 'report', id: embed.reportId, embedUrl: embed.embedUrl, accessToken: embed.embedToken, tokenType: models.TokenType.Embed, settings: { panes: { filters: { visible: false }, pageNavigation: { visible: true } } } }} cssClassName="w-full h-full" /></div> : <p className="text-xs text-slate-600 mt-2">Secure embed is ready for GET /api/get-powerbi-embed-token. The backend must return reportId, embedUrl, and a short-lived embedToken. Azure credentials never enter the browser.</p>}</div></section>
  </div>;
};

const Card: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5"><h2 className="font-bold text-slate-950">{title}</h2><p className="text-xs text-slate-500 mt-1 mb-4">{subtitle}</p><div className="h-72">{children}</div></div>;
