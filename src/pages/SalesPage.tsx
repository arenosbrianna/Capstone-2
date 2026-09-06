import React from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowUpRight, Clock3, Package, TrendingUp } from 'lucide-react';
import { HOURLY_RUSH, TOP_DISHES, WEEKLY_SALES } from '../data/mockData';
import { formatPeso } from '../utils/currency';

export const SalesPage: React.FC = () => {
  const bestDay = WEEKLY_SALES.reduce((best, day) => day.sales > best.sales ? day : best, WEEKLY_SALES[0]);
  const topDish = TOP_DISHES[0];
  return <div className="max-w-7xl mx-auto space-y-6">
    <header><p className="text-sm font-semibold text-blue-800">Sales analytics</p><h1 className="text-3xl font-extrabold tracking-tight text-slate-950 mt-1">Sales Analytics</h1><p className="text-sm text-slate-500 mt-1">Deep dive into your revenue and sales performance.</p></header>
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Summary icon={Clock3} title="Peak hours" value="6PM - 8PM" note="Accounts for 45% of daily revenue" />
      <Summary icon={Package} title="Top product" value="California Maki" note={`${formatPeso(topDish.revenue, 0)} revenue this period`} />
      <Summary icon={TrendingUp} title="Best day" value={bestDay.day === 'Sat' ? 'Saturday' : bestDay.day} note={`Average ${formatPeso(bestDay.sales, 0)} in sales`} />
    </section>
    <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      <ChartCard title="Revenue over time"><ResponsiveContainer width="100%" height="100%"><LineChart data={WEEKLY_SALES}><CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="day" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} tickFormatter={v => `₱${v / 1000}k`} /><Tooltip formatter={(v: number) => [formatPeso(v, 0), 'Revenue']} /><Line type="monotone" dataKey="sales" stroke="#1E3A8A" strokeWidth={3} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></ChartCard>
      <ChartCard title="Hourly sales distribution"><ResponsiveContainer width="100%" height="100%"><BarChart data={HOURLY_RUSH}><CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="time" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip formatter={(v: number) => [formatPeso(v, 0), 'Revenue']} /><Bar dataKey="sales" fill="#DC2626" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>
    </section>
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5"><h2 className="font-bold text-slate-950">Revenue by category</h2><p className="text-xs text-slate-500 mt-1 mb-4">Best-selling items contributing to this period&apos;s revenue</p><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">{TOP_DISHES.slice(0, 4).map(item => <div key={item.name} className="rounded-lg bg-slate-50 p-4"><p className="text-sm font-bold text-slate-900">{item.name}</p><p className="text-xs text-slate-500 mt-2">{item.sales} sold</p><p className="text-lg font-extrabold text-blue-900 mt-1">{formatPeso(item.revenue, 0)}</p></div>)}</div></section>
  </div>;
};

const Summary: React.FC<{ icon: React.ElementType; title: string; value: string; note: string }> = ({ icon: Icon, title, value, note }) => <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{title}</p><Icon className="w-5 h-5 text-blue-800" /></div><p className="text-2xl font-extrabold text-slate-950 mt-4">{value}</p><p className="text-xs text-slate-500 mt-2">{note}</p><ArrowUpRight className="w-4 h-4 text-emerald-600 mt-3" /></div>;
const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5"><h2 className="font-bold text-slate-950 mb-4">{title}</h2><div className="h-72">{children}</div></div>;
