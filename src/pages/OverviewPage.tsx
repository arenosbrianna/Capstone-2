import React, { useEffect, useState } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertTriangle, ArrowUpRight, Boxes, Check, ChevronRight, CircleDollarSign, Clock3, Sparkles, TrendingUp, X } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { RESTAURANT_PROFILE, TODAY_STATS, TOP_DISHES, WEEKLY_SALES } from '../data/mockData';
import { formatPeso } from '../utils/currency';

interface EmbedResponse { reportId: string; embedUrl: string; embedToken: string; }

const kpis = [
  { label: 'Total sales today', value: formatPeso(TODAY_STATS.totalSalesToday), note: `+${TODAY_STATS.salesGrowthPct}% from yesterday`, icon: CircleDollarSign, tone: 'blue' },
  { label: 'Orders count', value: TODAY_STATS.ordersCount.toString(), note: `+${TODAY_STATS.ordersGrowthPct}% from yesterday`, icon: TrendingUp, tone: 'green' },
  { label: 'Low stock alerts', value: TODAY_STATS.lowStockAlerts.toString(), note: 'Requires attention', icon: Boxes, tone: 'red' },
  { label: 'Near expiry items', value: TODAY_STATS.nearExpiryItems.toString(), note: 'Review needed', icon: Clock3, tone: 'red' },
];

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { inventory, recommendations, applyRecommendation, dismissRecommendation } = useDashboard();
  const [embed, setEmbed] = useState<EmbedResponse | null>(null);
  const activeRecommendations = recommendations.filter(item => !item.applied && !item.dismissed).slice(0, 2);
  const inventoryAlerts = inventory.filter(item => item.status !== 'normal').slice(0, 3);

  useEffect(() => {
    fetch('/api/get-powerbi-embed-token')
      .then(response => response.ok ? response.json() : null)
      .then(data => data?.reportId && setEmbed(data))
      .catch(() => undefined);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-800">Good morning, Admin</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 mt-1">Welcome to {RESTAURANT_PROFILE.name}</h1>
          <p className="text-sm text-slate-500 mt-1">Here&apos;s the pulse of your restaurant today.</p>
        </div>
        <button onClick={() => navigate('/reports')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-800">
          <ArrowUpRight className="w-4 h-4" /> Export report
        </button>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(({ label, value, note, icon: Icon, tone }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-start justify-between"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p><Icon className={`w-5 h-5 ${tone === 'red' ? 'text-red-600' : tone === 'green' ? 'text-emerald-600' : 'text-blue-800'}`} /></div>
            <p className="text-3xl font-extrabold font-mono text-slate-950 mt-4">{value}</p>
            <p className={`text-xs font-semibold mt-2 ${tone === 'red' ? 'text-red-600' : 'text-emerald-600'}`}>{note}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.85fr] gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-start justify-between mb-5"><div><h2 className="font-bold text-slate-950">Sales velocity</h2><p className="text-xs text-slate-500 mt-1">Daily revenue tracking from Loyverse POS</p></div><button onClick={() => navigate('/sales')} className="text-xs font-bold text-blue-800 hover:text-blue-600">Details <ChevronRight className="inline w-3 h-3" /></button></div>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={WEEKLY_SALES} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}><CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={value => `₱${value / 1000}k`} /><Tooltip formatter={(value: number) => [formatPeso(value, 0), 'Sales']} contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }} /><Bar dataKey="sales" fill="#1E3A8A" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"><div className="flex items-start justify-between mb-4"><div><h2 className="font-bold text-slate-950">Top performers</h2><p className="text-xs text-slate-500 mt-1">Best selling items today</p></div><TrendingUp className="w-5 h-5 text-blue-800" /></div><div className="divide-y divide-slate-100">{TOP_DISHES.slice(0, 3).map((dish, index) => <div key={dish.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"><span className="w-6 text-sm font-extrabold text-blue-800">#{index + 1}</span><div className="flex-1 min-w-0"><p className="text-sm font-bold text-slate-900 truncate">{dish.name}</p><p className="text-xs text-slate-500">{dish.sales} sold</p></div><span className="text-sm font-bold text-slate-900">{formatPeso(dish.revenue, 0)}</span></div>)}</div><button onClick={() => navigate('/sales')} className="w-full mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-blue-800 text-left">View menu performance <ChevronRight className="inline w-3 h-3" /></button></div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"><div className="flex items-start justify-between mb-4"><div><h2 className="font-bold text-slate-950">Inventory alerts</h2><p className="text-xs text-slate-500 mt-1">Ingredients needing action now</p></div><AlertTriangle className="w-5 h-5 text-red-600" /></div><div className="space-y-3">{inventoryAlerts.map(item => <div key={item.id} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3"><div className="w-2 h-2 rounded-full bg-red-600" /><div className="flex-1"><p className="text-sm font-bold text-slate-900">{item.name}</p><p className="text-xs text-slate-500">Only {item.stock}{item.unit} left</p></div><span className="text-[10px] font-bold uppercase text-red-700 bg-red-100 px-2 py-1 rounded">{item.status === 'critical' ? 'Critical' : 'Action req'}</span></div>)}</div><button onClick={() => navigate('/inventory')} className="mt-4 text-xs font-bold text-blue-800">Manage inventory <ChevronRight className="inline w-3 h-3" /></button></div>

        <div className="bg-blue-50/60 rounded-xl border border-blue-100 p-5 shadow-sm"><div className="flex items-start justify-between mb-4"><div><h2 className="font-bold text-slate-950">Smart actions</h2><p className="text-xs text-slate-500 mt-1">AI-driven optimizations for waste and stockouts</p></div><Sparkles className="w-5 h-5 text-blue-800" /></div><div className="space-y-3">{activeRecommendations.map(rec => <div key={rec.id} className="bg-white rounded-lg border border-blue-100 p-3"><p className="text-sm font-bold text-slate-900">{rec.title.split(':')[0]}</p><p className="text-xs text-slate-500 mt-1 line-clamp-2">{rec.description}</p><div className="flex gap-2 mt-3"><button onClick={() => applyRecommendation(rec.id)} className="inline-flex items-center gap-1 rounded-md bg-blue-900 px-3 py-1.5 text-xs font-bold text-white"><Check className="w-3 h-3" /> Apply</button><button onClick={() => dismissRecommendation(rec.id)} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-500"><X className="w-3 h-3" /></button></div></div>)}</div><button onClick={() => navigate('/recommendations')} className="mt-4 text-xs font-bold text-blue-800">View all insights <ChevronRight className="inline w-3 h-3" /></button></div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wide text-blue-800">DSS operating model</p><p className="text-sm text-slate-600 mt-1">CRISP-DM + DSR turns five years of POS history into forecasts, PuLP orders, and waste alerts.</p></div><button onClick={() => navigate('/analytics')} className="text-xs font-bold text-blue-800 whitespace-nowrap">View analytics <ChevronRight className="inline w-3 h-3" /></button></section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-bold text-slate-950">Power BI decision dashboard</h2><p className="text-xs text-slate-500 mt-1">Securely embedded predictive and prescriptive outputs for daily management.</p></div><span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-800">Dashboard integration</span></div>{embed ? <div className="h-96 mt-4 rounded-lg overflow-hidden border border-slate-200"><PowerBIEmbed embedConfig={{ type: 'report', id: embed.reportId, embedUrl: embed.embedUrl, accessToken: embed.embedToken, tokenType: models.TokenType.Embed, settings: { panes: { filters: { expanded: false, visible: false }, pageNavigation: { visible: true } } } }} cssClassName="w-full h-full" /></div> : <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-xs text-slate-600">Configure GET /api/get-powerbi-embed-token to display the report. The endpoint must return reportId, embedUrl, and a short-lived embedToken; Azure credentials remain server-side.</div>}</section>
    </div>
  );
};
