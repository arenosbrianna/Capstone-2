import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider } from './context/DashboardContext';
import { AppLayout } from './components/layout/AppLayout';
import { OverviewPage } from './pages/OverviewPage';
import { SalesPage } from './pages/SalesPage';
import { InventoryPage } from './pages/InventoryPage';
import { ForecastingPage } from './pages/ForecastingPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { WastePage } from './pages/WastePage';
import { SuppliersPage } from './pages/SuppliersPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <DashboardProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="forecasting" element={<ForecastingPage />} />
            <Route path="recommendations" element={<RecommendationsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="waste" element={<WastePage />} />
            <Route path="suppliers" element={<SuppliersPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DashboardProvider>
  );
};

export default App;
