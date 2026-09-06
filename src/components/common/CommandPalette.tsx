import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import { 
  Search, 
  LayoutDashboard, 
  TrendingUp, 
  Boxes, 
  BrainCircuit,
  LineChart, 
  Sparkles, 
  FileText, 
  Plus, 
  X
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    inventory, 
    setIsAddItemModalOpen 
  } = useDashboard();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isCommandPaletteOpen) {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const quickNav = [
    { name: 'Operations Pulse (Executive Dashboard)', path: '/', icon: LayoutDashboard },
    { name: 'Sales & Revenue Analytics', path: '/sales', icon: TrendingUp },
    { name: 'Perishable Raw Materials Inventory', path: '/inventory', icon: Boxes },
    { name: 'Demand Forecasting (SARIMA, Holt-Winters, SES, ML)', path: '/forecasting', icon: BrainCircuit },
    { name: 'Prescriptive Actions & Optimization', path: '/recommendations', icon: Sparkles },
    { name: 'Waste Ledger & Menu Engineering Matrix', path: '/analytics', icon: LineChart },
    { name: 'Audit Reports & Export Catalog', path: '/reports', icon: FileText },
  ];

  const filteredNav = quickNav.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const handleSelectRoute = (path: string) => {
    navigate(path);
    setIsCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command, forecasting model, or search raw materials..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full py-4 text-base bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400"
          />
          <button 
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 space-y-3">
          <div>
            <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Quick Actions
            </div>
            <button
              onClick={() => {
                setIsCommandPaletteOpen(false);
                setIsAddItemModalOpen(true);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-900 rounded-xl transition-colors text-left"
            >
              <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                <Plus className="w-4 h-4" />
              </div>
              <span className="font-medium">Add New Raw Material Ingredient</span>
            </button>
          </div>

          {filteredNav.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Modules & Analytics
              </div>
              <div className="space-y-1">
                {filteredNav.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleSelectRoute(item.path)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-colors text-left"
                    >
                      <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredInventory.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Ingredients & Shelf Life
              </div>
              <div className="space-y-1">
                {filteredInventory.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate('/inventory');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-xl transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{item.name}</span>
                      <span className="text-xs text-slate-400">({item.category})</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-medium">{item.stock} {item.unit}</span>
                      <span className={`px-2 py-0.5 rounded font-medium ${
                        item.status === 'critical' ? 'bg-rose-100 text-rose-700' :
                        item.status === 'low' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Makisushi DSS • 160 Panay Ave, QC</span>
          <span className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-slate-200">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
