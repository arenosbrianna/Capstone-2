import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { X, Plus, Package } from 'lucide-react';
import { InventoryItem } from '../../types';

export const AddItemModal: React.FC = () => {
  const { isAddItemModalOpen, setIsAddItemModalOpen, addItem } = useDashboard();
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Seafood' as InventoryItem['category'],
    stock: '',
    unit: 'kg',
    minPar: '',
    costPerUnit: '',
    supplier: '',
    expiryDays: '5',
  });

  if (!isAddItemModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.stock || !formData.minPar) return;

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (parseInt(formData.expiryDays) || 5));

    addItem({
      name: formData.name.trim(),
      category: formData.category,
      stock: parseFloat(formData.stock) || 0,
      unit: formData.unit,
      minPar: parseFloat(formData.minPar) || 0,
      costPerUnit: parseFloat(formData.costPerUnit) || 0,
      supplier: formData.supplier.trim() || 'Direct Supplier',
      expiryDate: expiryDate.toISOString().slice(0, 10),
      status: 'normal',
      suggestedOrder: 0,
      lastRestocked: new Date().toISOString().slice(0, 10),
    });

    setFormData({
      name: '',
      category: 'Seafood',
      stock: '',
      unit: 'kg',
      minPar: '',
      costPerUnit: '',
      supplier: '',
      expiryDays: '5',
    });
    setIsAddItemModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Add Inventory Item</h3>
              <p className="text-xs text-slate-500">Track raw ingredients and set automated par thresholds</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAddItemModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Item Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Fresh Scottish Salmon"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white"
              >
                <option value="Seafood">Seafood</option>
                <option value="Produce">Produce</option>
                <option value="Dry Goods">Dry Goods</option>
                <option value="Condiments">Condiments</option>
                <option value="Beverages">Beverages</option>
                <option value="Packaging">Packaging</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Unit of Measure
              </label>
              <select
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white"
              >
                <option value="kg">kg (Kilograms)</option>
                <option value="pcs">pcs (Pieces)</option>
                <option value="packs">packs</option>
                <option value="L">L (Liters)</option>
                <option value="tubes">tubes</option>
                <option value="btls">btls (Bottles)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Initial Stock *
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="10"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-orange-500 outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Min Par Level *
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="15"
                value={formData.minPar}
                onChange={e => setFormData({ ...formData, minPar: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-orange-500 outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Cost / Unit (PHP)
              </label>
              <input
                type="number"
                step="any"
                placeholder="18.50"
                value={formData.costPerUnit}
                onChange={e => setFormData({ ...formData, costPerUnit: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-orange-500 outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Supplier
              </label>
              <input
                type="text"
                placeholder="e.g. Pacific Blue Seafood"
                value={formData.supplier}
                onChange={e => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Shelf Life (Days)
              </label>
              <input
                type="number"
                placeholder="5"
                value={formData.expiryDays}
                onChange={e => setFormData({ ...formData, expiryDays: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-orange-500 outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddItemModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Save Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
