import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { 
  FORECAST_MODELS, 
  INGREDIENT_FORECAST_SERIES 
} from '../data/mockData';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { 
  TrendingUp, 
  BrainCircuit, 
  Award, 
  AlertCircle, 
  Layers, 
  Calendar, 
  CheckCircle2, 
  Info,
  Flame,
  ArrowRight
} from 'lucide-react';

export const ForecastingPage: React.FC = () => {
  const { 
    selectedForecastIngredient, 
    setSelectedForecastIngredient,
    selectedForecastModel,
    setSelectedForecastModel
  } = useDashboard();

  const [showAllModels, setShowAllModels] = useState(false);

  const availableIngredients = Object.keys(INGREDIENT_FORECAST_SERIES);
  const currentSeries = INGREDIENT_FORECAST_SERIES[selectedForecastIngredient] || INGREDIENT_FORECAST_SERIES['Fresh Salmon'];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100/70 text-orange-800 border border-orange-200/60">
              <BrainCircuit className="w-3.5 h-3.5 text-orange-600" />
              Predictive Time-Series Engine
            </span>
            <span className="text-xs text-slate-400 font-medium">• Python statsmodels & pmdarima</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Perishable Demand Forecasting
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            14-day ingredient-level consumption forecasting to power linear programming inventory replenishment.
          </p>
        </div>

        {/* Ingredient Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-500 font-medium">Ingredient:</span>
          <select
            value={selectedForecastIngredient}
            onChange={e => setSelectedForecastIngredient(e.target.value)}
            className="bg-white border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-2 outline-none shadow-2xs focus:border-orange-500"
          >
            {availableIngredients.map(ing => (
              <option key={ing} value={ing}>{ing}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Model Performance Comparison Cards */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-600" />
              Model Accuracy Benchmark (Holdout Validation)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Evaluated on 5-year historical Loyverse POS transaction logs disaggregated via Bill of Materials
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Champion Model: <strong className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">SARIMA(1,1,1)(1,1,1)₇</strong>
          </span>
        </div>

        {/* Model Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FORECAST_MODELS.map(model => (
            <div
              key={model.modelName}
              onClick={() => setSelectedForecastModel(model.modelName)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedForecastModel === model.modelName
                  ? 'border-orange-500 bg-orange-50/30 shadow-xs ring-1 ring-orange-500'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-slate-900">{model.modelName}</span>
                  {model.selected && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Deployed
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-snug mb-3">{model.bestUsedFor}</p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">WMAPE</span>
                    <span className="font-bold text-slate-900">{model.wmape}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">MASE</span>
                    <span className="font-bold text-slate-900">{model.mase}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">RMSE</span>
                    <span className="text-slate-600">{model.rmse}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">MAE</span>
                    <span className="text-slate-600">{model.mae}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-orange-600 font-semibold">
                <span>{selectedForecastModel === model.modelName ? 'Viewing Curve' : 'Compare'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Academic Note on Scale-Independent Metrics */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-900 flex items-start gap-2.5 leading-relaxed">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <strong>Why WMAPE and MASE over traditional MAPE?</strong> Traditional MAPE encounters an undefined division-by-zero error on intermittent days with zero ingredient usage. Furthermore, MAPE treats over-forecasting (food spoilage) and under-forecasting (stockouts) symmetrically. <strong>WMAPE</strong> divides total absolute errors by total volume to eliminate zero-demand distortion, while <strong>MASE</strong> scales error against a naive benchmark to ensure the deployed model demonstrably outperforms baseline intuition.
          </div>
        </div>
      </div>

      {/* Main Forecast Visualization Chart */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              14-Day Demand Projections: {selectedForecastIngredient}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Comparing actual consumption against model forecasts and PuLP optimal replenishment
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAllModels(prev => !prev)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                showAllModels 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {showAllModels ? 'Viewing All 4 Models' : 'Show Multi-Model Overlay'}
            </button>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={currentSeries} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={v => `${v} kg`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                formatter={(val: any, name: string) => [`${val} kg`, name]}
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} 
              />
              <ReferenceLine x="Sep 13" stroke="#94a3b8" strokeDasharray="3 3" label={{ value: 'Forecast Horizon', fill: '#64748b', fontSize: 10, position: 'insideTopLeft' }} />

              <Line type="monotone" dataKey="actualDemand" stroke="#0f172a" strokeWidth={2.5} dot={{ r: 4 }} name="Actual POS Usage" connectNulls={false} />
              
              {(!showAllModels || selectedForecastModel === 'SARIMA') && (
                <Line type="monotone" dataKey="sarimaForecast" stroke="#1E3A8A" strokeWidth={2.5} strokeDasharray="4 4" dot={false} name="SARIMA(1,1,1)(1,1,1)7 (Champion)" />
              )}
              {(showAllModels || selectedForecastModel === 'Holt-Winters') && (
                <Line type="monotone" dataKey="holtWintersForecast" stroke="#0284c7" strokeWidth={2} strokeDasharray="3 3" dot={false} name="Holt-Winters" />
              )}
              {(showAllModels || selectedForecastModel === 'ML Regression') && (
                <Line type="monotone" dataKey="mlForecast" stroke="#10b981" strokeWidth={2} strokeDasharray="2 2" dot={false} name="ML Regression (Exogenous)" />
              )}
              {(showAllModels || selectedForecastModel === 'SES') && (
                <Line type="monotone" dataKey="sesForecast" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Simple Exponential Smoothing" />
              )}

              <Line type="stepAfter" dataKey="recommendedOrder" stroke="#DC2626" strokeWidth={2} dot={false} name="PuLP Replenishment Target" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend Notes */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-900" /> Historical POS Demand
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-orange-600 border-dashed" /> Predictive Forecast
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-500" /> PuLP Order Quantity
            </span>
          </div>
          <span className="font-medium text-slate-400">
            Next Weekly Model Retraining: Monday 03:00 AM
          </span>
        </div>
      </div>

      {/* Bill of Materials (BOM) Disaggregation Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Ingredient-Level Disaggregation (Bill of Materials)
            </h2>
            <p className="text-xs text-slate-500">
              Mapping Loyverse POS customer checkout transactions into perishable raw material gram weights
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
            dim_ingredient ↔ dim_menu_item
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5">Menu Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">POS Price</th>
                <th className="py-3 px-4">Disaggregated Perishable Ingredients</th>
                <th className="py-3 px-4 text-right">Daily Consumption Velocity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              <tr className="hover:bg-slate-50/60">
                <td className="py-3.5 px-5 font-bold text-slate-900">California Maki</td>
                <td className="py-3.5 px-4 text-slate-500">Specialty Rolls</td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">₱280.00</td>
                <td className="py-3.5 px-4">
                  <span className="text-slate-700">Fresh Salmon (80g), Koshihikari Rice (120g), Nori (1 sheet), Avocado (0.25 pc)</span>
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">48 rolls / day</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="py-3.5 px-5 font-bold text-slate-900">Salmon Sashimi (3pcs)</td>
                <td className="py-3.5 px-4 text-slate-500">Nigiri & Sashimi</td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">₱240.00</td>
                <td className="py-3.5 px-4">
                  <span className="text-slate-700">Fresh Scottish Salmon (120g), Fresh Wasabi (5g), Shredded Daikon</span>
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">36 orders / day</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="py-3.5 px-5 font-bold text-slate-900">Dragon Roll</td>
                <td className="py-3.5 px-4 text-slate-500">Specialty Rolls</td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">₱380.00</td>
                <td className="py-3.5 px-4">
                  <span className="text-slate-700">Black Tiger Ebi (100g), Hass Avocado (0.50 pc), Koshihikari Rice (150g), Eel Sauce</span>
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">25 rolls / day</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="py-3.5 px-5 font-bold text-slate-900">Spicy Tuna Deluxe</td>
                <td className="py-3.5 px-4 text-slate-500">Specialty Rolls</td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">₱310.00</td>
                <td className="py-3.5 px-4">
                  <span className="text-slate-700">Bluefin Tuna Loin (90g), Japanese Cucumber (30g), Nori (1 sheet), Spicy Mayo</span>
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">31 rolls / day</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
