export type TimeRange = 'today' | 'yesterday' | '7days' | '30days';

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Seafood' | 'Produce' | 'Dry Goods' | 'Condiments' | 'Beverages' | 'Packaging';
  stock: number; // stock_on_hand
  unit: string;
  minPar: number; // reorder_level
  costPerUnit: number;
  receiptDate: string;
  shelfLifeDays: number;
  expiryDate: string;
  status: 'critical' | 'low' | 'normal';
  suggestedOrder: number; // optimal replenishment calculated via Linear Programming (PuLP)
  supplierId: string;
  supplierName: string;
  supplierContact: string;
  leadTimeDays: number;
  wasteRecordedKg: number;
  spoilageRiskScore: number; // 0-100 calculated from expiry proximity and consumption rate
  riskState: 'expiration_risk' | 'over_ordering' | 'under_ordering' | 'optimal';
  excessCapitalAmount?: number;
}

export interface Recommendation {
  id: string;
  type: 'replenishment' | 'reduction' | 'expedited_use' | 'promotional_special';
  riskState: 'expiration_risk' | 'over_ordering' | 'under_ordering';
  title: string;
  description: string;
  ingredientId: string;
  ingredientName: string;
  targetSupplier: string;
  supplierContact: string;
  leadTimeDays: number;
  recommendedQuantity: number;
  unit: string;
  priority: 'critical' | 'high' | 'medium';
  estimatedImpact: string;
  costSavings: number;
  applied?: boolean;
  dismissed?: boolean;
}

export interface ForecastModelComparison {
  modelName: 'SES' | 'SARIMA' | 'Holt-Winters' | 'ML Regression';
  fullName: string;
  bestUsedFor: string;
  wmape: number; // Weighted Mean Absolute Percentage Error
  mase: number;  // Mean Absolute Scaled Error
  rmse: number;
  mae: number;
  selected: boolean;
  strengths: string;
  limitations: string;
}

export interface IngredientForecastPoint {
  date: string;
  dayOfWeek: string;
  actualDemand?: number;
  sesForecast: number;
  sarimaForecast: number;
  holtWintersForecast: number;
  mlForecast: number;
  recommendedOrder: number;
  isWeekend: boolean;
  isHoliday?: boolean;
}

export interface BaselineMetrics {
  weeklyWasteKgBaseline: number;
  weeklyWasteKgCurrent: number;
  spoilageRateBaseline: number;
  spoilageRateCurrent: number;
  stockoutFreqBaseline: number; // incidents/month
  stockoutFreqCurrent: number;
  inventoryTurnoverBaseline: number;
  inventoryTurnoverCurrent: number;
}

export interface ReportItem {
  id: string;
  name: string;
  desc: string;
  type: 'PDF' | 'CSV' | 'XLSX';
  lastGenerated: string;
  frequency: string;
  fileSize: string;
  category: string;
}

export interface TopDish {
  name: string;
  sales: number;
  revenue: number;
  margin: number;
  trend: 'up' | 'down' | 'steady';
  category: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'warning' | 'info' | 'success';
  read: boolean;
  link?: string;
}
