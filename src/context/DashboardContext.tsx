import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  TimeRange, 
  InventoryItem, 
  Recommendation, 
  ReportItem, 
  NotificationItem,
  ForecastModelComparison
} from '../types';
import { 
  INITIAL_INVENTORY, 
  INITIAL_RECOMMENDATIONS, 
  INITIAL_REPORTS, 
  INITIAL_NOTIFICATIONS,
  FORECAST_MODELS,
  RESTAURANT_PROFILE
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface DashboardContextType {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  
  // Inventory
  inventory: InventoryItem[];
  addItem: (item: Omit<InventoryItem, 'id' | 'spoilageRiskScore' | 'riskState'>) => void;
  updateStock: (id: string, newStock: number) => void;
  deleteItem: (id: string) => void;
  
  // Forecasting
  forecastModels: ForecastModelComparison[];
  selectedForecastIngredient: string;
  setSelectedForecastIngredient: (ing: string) => void;
  selectedForecastModel: 'SARIMA' | 'Holt-Winters' | 'ML Regression' | 'SES';
  setSelectedForecastModel: (model: 'SARIMA' | 'Holt-Winters' | 'ML Regression' | 'SES') => void;

  // Prescriptive Recommendations
  recommendations: Recommendation[];
  applyRecommendation: (id: string) => void;
  dismissRecommendation: (id: string) => void;
  applyAllHighPriority: () => void;
  
  // Reports & Exports
  reports: ReportItem[];
  downloadReport: (report: ReportItem) => void;
  scheduleReport: (reportName: string, frequency: string, email: string) => void;
  
  // Notifications
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  
  // Command Palette
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  
  // Modals
  isAddItemModalOpen: boolean;
  setIsAddItemModalOpen: (open: boolean) => void;
  isScheduleReportModalOpen: boolean;
  setIsScheduleReportModalOpen: (open: boolean) => void;
  
  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('today');
  
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);
  const [reports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [forecastModels] = useState<ForecastModelComparison[]>(FORECAST_MODELS);
  const [selectedForecastIngredient, setSelectedForecastIngredient] = useState<string>('Fresh Salmon');
  const [selectedForecastModel, setSelectedForecastModel] = useState<'SARIMA' | 'Holt-Winters' | 'ML Regression' | 'SES'>('SARIMA');
  
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isScheduleReportModalOpen, setIsScheduleReportModalOpen] = useState(false);
  
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Inventory actions
  const addItem = (newItemData: Omit<InventoryItem, 'id' | 'spoilageRiskScore' | 'riskState'>) => {
    const id = 'ing-' + (inventory.length + 1);
    const spoilageRiskScore = newItemData.shelfLifeDays <= 3 ? 85 : newItemData.shelfLifeDays <= 7 ? 45 : 15;
    const riskState: InventoryItem['riskState'] = 
      spoilageRiskScore > 75 ? 'expiration_risk' :
      newItemData.stock < newItemData.minPar ? 'under_ordering' :
      newItemData.stock > newItemData.minPar * 2 ? 'over_ordering' : 'optimal';

    const newItem: InventoryItem = {
      id,
      ...newItemData,
      spoilageRiskScore,
      riskState,
      status: newItemData.stock <= newItemData.minPar * 0.3 ? 'critical' : newItemData.stock <= newItemData.minPar ? 'low' : 'normal',
      suggestedOrder: newItemData.stock < newItemData.minPar ? Math.ceil(newItemData.minPar * 1.5 - newItemData.stock) : 0,
    };
    setInventory(prev => [newItem, ...prev]);
    showToast(`Added "${newItem.name}" to inventory ledger`, 'success');
  };

  const updateStock = (id: string, newStock: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id !== id) return item;
      const status: 'critical' | 'low' | 'normal' = newStock <= item.minPar * 0.3 ? 'critical' : newStock <= item.minPar ? 'low' : 'normal';
      const suggestedOrder = newStock < item.minPar ? Math.ceil(item.minPar * 1.5 - newStock) : 0;
      const riskState: InventoryItem['riskState'] = 
        newStock < item.minPar ? 'under_ordering' :
        newStock > item.minPar * 2 ? 'over_ordering' : item.riskState;

      return { ...item, stock: newStock, status, suggestedOrder, riskState };
    }));
    showToast('Stock level & replenishment quantity updated', 'info');
  };

  const deleteItem = (id: string) => {
    const item = inventory.find(i => i.id === id);
    setInventory(prev => prev.filter(i => i.id !== id));
    showToast(`Removed "${item?.name || 'Item'}" from ledger`, 'info');
  };

  // Recommendations actions
  const applyRecommendation = (id: string) => {
    const rec = recommendations.find(r => r.id === id);
    setRecommendations(prev => prev.map(r => r.id === id ? { ...r, applied: true } : r));
    showToast(`Enacted: "${rec?.title}"`, 'success');
  };

  const dismissRecommendation = (id: string) => {
    setRecommendations(prev => prev.map(r => r.id === id ? { ...r, dismissed: true } : r));
    showToast('Recommendation dismissed', 'info');
  };

  const applyAllHighPriority = () => {
    const targets = recommendations.filter(r => (r.priority === 'critical' || r.priority === 'high') && !r.applied && !r.dismissed);
    if (targets.length === 0) {
      showToast('No active high-priority recommendations to apply', 'info');
      return;
    }
    setRecommendations(prev => prev.map(r => {
      if ((r.priority === 'critical' || r.priority === 'high') && !r.dismissed) {
        return { ...r, applied: true };
      }
      return r;
    }));
    showToast(`Enacted ${targets.length} priority interventions`, 'success');
  };

  // Report downloads
  const downloadReport = (report: ReportItem) => {
    let content = '';
    let filename = `makisushi_${report.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}`;
    let mimeType = 'text/plain';

    if (report.type === 'CSV') {
      filename += '.csv';
      mimeType = 'text/csv';
      if (report.id === 'r1') {
        content = 'TransactionID,Date,Time,MenuItem,IngredientDisaggregation,QuantitySold,RevenuePHP,FoodCostPct\n';
        content += 'TX-90412,2026-09-06,12:15,California Maki,"Salmon 0.08kg; Rice 0.12kg; Nori 1pc; Avocado 0.25pc",4,46.00,28.5%\n';
        content += 'TX-90413,2026-09-06,12:18,Salmon Sashimi 3pcs,"Fresh Salmon 0.12kg",2,28.00,26.4%\n';
        content += 'TX-90414,2026-09-06,12:22,Dragon Roll,"Ebi 0.10kg; Avocado 0.5pc; Rice 0.15kg",3,55.50,29.8%\n';
        content += 'TX-90415,2026-09-06,12:40,Spicy Tuna Deluxe,"Tuna Loin 0.09kg; Rice 0.12kg; Nori 1pc",5,80.00,30.2%\n';
      } else if (report.id === 'r4') {
        content = 'Ingredient,ForecastModel,WMAPE_Pct,MASE,RMSE,MAE,SelectedStatus\n';
        content += 'Fresh Salmon,SARIMA(1-1-1)(1-1-1)7,8.4%,0.72,2.41,1.85,SELECTED\n';
        content += 'Fresh Salmon,Holt-Winters,9.8%,0.81,2.85,2.15,EVALUATED\n';
        content += 'Fresh Salmon,ML Regression,10.2%,0.84,2.92,2.20,EVALUATED\n';
        content += 'Fresh Salmon,SES,14.6%,1.15,3.90,3.10,EVALUATED\n';
        content += 'Sushi Rice,SARIMA,6.2%,0.58,1.80,1.40,SELECTED\n';
      } else {
        content = 'IngredientID,IngredientName,SupplierID,SupplierName,ContactPhone,CurrentStock,MinPar,OptimalOrderQty,Unit,LeadTimeDays,EstCost\n';
        inventory.forEach(item => {
          content += `${item.id},"${item.name}",${item.supplierId},"${item.supplierName}","${item.supplierContact}",${item.stock},${item.minPar},${item.suggestedOrder},${item.unit},${item.leadTimeDays},${(item.suggestedOrder * item.costPerUnit).toFixed(2)}\n`;
        });
      }
    } else {
      filename += '.txt';
      mimeType = 'text/plain';
      content = `=======================================================================\n`;
      content += `${RESTAURANT_PROFILE.fullName.toUpperCase()}\n`;
      content += `${RESTAURANT_PROFILE.address}\n`;
      content += `Proprietor: ${RESTAURANT_PROFILE.proprietor}\n`;
      content += `REPORT: ${report.name.toUpperCase()}\n`;
      content += `Generated At: ${new Date().toLocaleString()} (ETL Batch Sync)\n`;
      content += `=======================================================================\n\n`;
      content += `1. EXECUTIVE OPERATIONS SUMMARY\n`;
      content += `- Data Source: ${RESTAURANT_PROFILE.dataSource}\n`;
      content += `- Weekly Food Waste Baseline: 24.5 kg -> Current DSS: 14.2 kg (-42.0% Reduction)\n`;
      content += `- Ingredient Spoilage Rate: 6.8% Baseline -> Current DSS: 2.4%\n`;
      content += `- Stockout Frequency: 3.2 incidents/mo -> Current DSS: 0.4 incidents/mo\n`;
      content += `- Inventory Turnover: 4.2x Baseline -> Current DSS: 7.8x\n\n`;
      content += `2. LINEAR PROGRAMMING REPLENISHMENT MANIFEST\n`;
      inventory.filter(i => i.suggestedOrder > 0).forEach(i => {
        content += `* ${i.name}: Order ${i.suggestedOrder} ${i.unit} from ${i.supplierName} (Lead: ${i.leadTimeDays}d) | Tel: ${i.supplierContact}\n`;
      });
      content += `\n3. SPOILAGE ALERT MATRIX\n`;
      inventory.filter(i => i.riskState === 'expiration_risk').forEach(i => {
        content += `! [EXPIRATION RISK] ${i.name} (${i.stock} ${i.unit}) expires on ${i.expiryDate}. Risk Score: ${i.spoilageRiskScore}/100.\n`;
      });
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Generated "${report.name}" (${report.type})`, 'success');
  };

  const scheduleReport = (reportName: string, frequency: string, email: string) => {
    showToast(`Scheduled "${reportName}" (${frequency}) to ${email}`, 'success');
    setIsScheduleReportModalOpen(false);
  };

  // Notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  return (
    <DashboardContext.Provider value={{
      timeRange,
      setTimeRange,
      inventory,
      addItem,
      updateStock,
      deleteItem,
      forecastModels,
      selectedForecastIngredient,
      setSelectedForecastIngredient,
      selectedForecastModel,
      setSelectedForecastModel,
      recommendations,
      applyRecommendation,
      dismissRecommendation,
      applyAllHighPriority,
      reports,
      downloadReport,
      scheduleReport,
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      isNotificationOpen,
      setIsNotificationOpen,
      isCommandPaletteOpen,
      setIsCommandPaletteOpen,
      isAddItemModalOpen,
      setIsAddItemModalOpen,
      isScheduleReportModalOpen,
      setIsScheduleReportModalOpen,
      toasts,
      showToast,
      dismissToast,
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
