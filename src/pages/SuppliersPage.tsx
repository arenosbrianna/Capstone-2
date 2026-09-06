import React from 'react';
import { Building2, ChevronRight, Clock3, Phone, Truck } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { InventoryItem } from '../types';

export const SuppliersPage: React.FC = () => {
  const { inventory } = useDashboard();
  const suppliers = Array.from(new Map(inventory.map(item => [item.supplierId, item])).values());
  return <div className="max-w-7xl mx-auto space-y-6">
    <header><p className="text-sm font-semibold text-blue-800">Procurement network</p><h1 className="text-3xl font-extrabold tracking-tight text-slate-950 mt-1">Suppliers</h1><p className="text-sm text-slate-500 mt-1">Manage vendor contacts, lead times, and the ingredients connected to each order.</p></header>
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4"><Metric label="Active suppliers" value={suppliers.length.toString()} /><Metric label="Items with lead time" value={`${inventory.filter(item => item.leadTimeDays > 0).length}`} /><Metric label="Orders needing action" value={`${inventory.filter(item => item.suggestedOrder > 0).length}`} /></section>
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">{suppliers.map(item => <SupplierCard key={item.supplierId} item={item} />)}</section>
    <section className="rounded-xl border border-blue-100 bg-blue-50/60 p-5 flex items-start gap-3"><Truck className="w-5 h-5 text-blue-800 mt-0.5" /><div><h2 className="font-bold text-slate-950">Supplier purchasing list</h2><p className="text-sm text-slate-600 mt-1">The PuLP optimizer pairs each recommended order quantity with the correct supplier, contact, and delivery lead time.</p></div></section>
  </div>;
};

const SupplierCard: React.FC<{ item: InventoryItem }> = ({ item }) => <article className="bg-white rounded-xl border border-slate-200 shadow-sm p-5"><div className="flex items-start justify-between gap-4"><div className="flex gap-3"><div className="rounded-lg bg-blue-50 p-2"><Building2 className="w-5 h-5 text-blue-800" /></div><div><h2 className="font-bold text-slate-950">{item.supplierName}</h2><p className="text-xs text-slate-500 mt-1">{item.supplierId}</p></div></div><ChevronRight className="w-4 h-4 text-slate-400" /></div><div className="grid grid-cols-2 gap-3 mt-5 text-xs"><div className="flex items-start gap-2"><Phone className="w-3.5 h-3.5 text-blue-800 mt-0.5" /><span className="text-slate-600">{item.supplierContact}</span></div><div className="flex items-start gap-2"><Clock3 className="w-3.5 h-3.5 text-red-600 mt-0.5" /><span className="text-slate-600">{item.leadTimeDays} day lead time</span></div></div><div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between text-xs"><span className="text-slate-500">Linked ingredient</span><span className="font-bold text-slate-900">{item.name}</span></div></article>;
const Metric: React.FC<{ label: string; value: string }> = ({ label, value }) => <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="text-2xl font-extrabold font-mono text-slate-950 mt-3">{value}</p></div>;
