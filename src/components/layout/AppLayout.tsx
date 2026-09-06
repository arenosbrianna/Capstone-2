import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import {
  LayoutDashboard, 
  Boxes, 
  LineChart,
  Trash2,
  Truck,
  Sparkles, 
  FileText, 
  Search, 
  Bell, 
  Menu, 
  X, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
} from 'lucide-react';
import { ToastContainer } from '../common/Toast';
import { CommandPalette } from '../common/CommandPalette';
import { AddItemModal } from '../modals/AddItemModal';
import { ScheduleReportModal } from '../modals/ScheduleReportModal';

export const AppLayout: React.FC = () => {
  const { 
    unreadCount, 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    isNotificationOpen, 
    setIsNotificationOpen, 
    setIsCommandPaletteOpen,
    inventory,
    recommendations,
    showToast
  } = useDashboard();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const criticalInventoryCount = inventory.filter(i => i.status === 'critical').length;
  const activeRecommendationsCount = recommendations.filter(r => !r.applied && !r.dismissed).length;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, badge: null },
    { name: 'Inventory', path: '/inventory', icon: Boxes, badge: criticalInventoryCount > 0 ? `${criticalInventoryCount}` : null, badgeColor: 'bg-red-100 text-red-700' },
    { name: 'Suppliers', path: '/suppliers', icon: Truck, badge: null },
    { name: 'Waste & Spoilage', path: '/waste', icon: Trash2, badge: null },
    { name: 'Analytics', path: '/analytics', icon: LineChart, badge: null },
    { name: 'Insights', path: '/recommendations', icon: Sparkles, badge: activeRecommendationsCount > 0 ? activeRecommendationsCount.toString() : null, badgeColor: 'bg-blue-100 text-blue-800' },
    { name: 'Reports', path: '/reports', icon: FileText, badge: null },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col antialiased">
      {/* Top Universal App Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-6 h-16 flex items-center justify-between shadow-xs relative">
        {/* Left: Brand + Location */}
        <div className="flex items-center gap-4 lg:gap-6">
          <button 
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center cursor-pointer select-none group"
          >
            <img src="/makisushi%20header.jpg" alt="Makisushi Japanese Restaurant" draggable="false" className="h-14 w-[250px] object-contain object-left group-hover:scale-[1.02] transition-transform" />
          </div>
        </div>

        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-[min(42vw,520px)] items-center gap-2 px-4 py-2 text-sm text-slate-500 bg-slate-100/70 hover:bg-slate-200/70 rounded-xl transition-colors border border-slate-200/60"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="flex-1 text-left">Search</span>
        </button>

        {/* Right: Data Pipeline Status + Search + Notifications + Profile */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(prev => !prev)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Open notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white" />
              )}
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* User Profile */}
          <div className="relative">
            <button onClick={() => setProfileOpen(prev => !prev)} className="flex items-center gap-2 pl-1 rounded-lg hover:bg-slate-100 p-1.5" aria-expanded={profileOpen} aria-label="Open Admin profile menu">
              <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center border border-blue-950 shadow-xs">A</div>
              <div className="hidden lg:block text-left"><div className="text-xs font-semibold text-slate-800 leading-none">Admin</div></div>
            </button>
            {profileOpen && <div className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"><div className="px-3 py-2 text-xs text-slate-500 border-b border-slate-100">Signed in as <strong className="text-slate-900">Admin</strong></div><button onClick={() => { setProfileOpen(false); showToast('Sign out requested', 'info'); }} className="w-full text-left px-3 py-2 mt-1 rounded-lg text-sm font-semibold text-red-700 hover:bg-red-50">Sign out</button></div>}
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200/80 p-4 shrink-0 justify-between">
          <div className="space-y-6">
            <div>
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Workspace
              </div>
              <nav className="space-y-1">
                {navItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) => `
                        flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                        ${isActive 
                          ? 'bg-blue-50 text-blue-950 font-semibold shadow-xs border border-blue-200/60' 
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'}
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-3">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-blue-800' : 'text-slate-400'}`} />
                            <span>{item.name}</span>
                          </div>
                          {item.badge && (
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Sidebar Footer: Capstone & Methodology Info */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                DSR & CRISP-DM
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded font-bold">PuLP Active</span>
            </div>
            <div className="text-[11px] text-slate-500 leading-relaxed">
              Linear programming minimization of combined spoilage and stockout costs across weekly replenishment cycles.
            </div>
            <div className="pt-1 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>Next ETL: 15:30</span>
              <Clock className="w-3 h-3 text-slate-400" />
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 bg-white h-full shadow-2xl p-5 flex flex-col justify-between z-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="font-extrabold text-slate-900 tracking-tight text-lg">Makisushi DSS</div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map(item => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) => `
                          flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium
                          ${isActive 
                            ? 'bg-blue-50 text-blue-950 font-semibold border border-blue-200' 
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-blue-800" />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
                Makisushi Japanese Restaurant • QC
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-[1500px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Notifications Drawer */}
      {isNotificationOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
            onClick={() => setIsNotificationOpen(false)} 
          />
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl border-l border-slate-200 p-5 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-800" />
                  <h3 className="font-bold text-slate-900 text-base">Operational Alerts</h3>
                </div>
                <button 
                  onClick={() => setIsNotificationOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-xs text-slate-500">{unreadCount} unread notices</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs font-semibold text-blue-800 hover:text-blue-600"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100 mt-2 space-y-1 max-h-[calc(100vh-140px)] overflow-y-auto">
                {notifications.map(n => (
                  <div 
                    key={n.id} 
                    onClick={() => {
                      markAsRead(n.id);
                      if (n.link) {
                        navigate(n.link);
                        setIsNotificationOpen(false);
                      }
                    }}
                    className={`p-3 rounded-xl transition-colors cursor-pointer ${n.read ? 'opacity-70 hover:bg-slate-50' : 'bg-blue-50/70 hover:bg-blue-100/70'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2">{n.message}</p>
                    {n.link && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 hover:underline">
                        View action <ExternalLink className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Modals & Toasts */}
      <ToastContainer />
      <CommandPalette />
      <AddItemModal />
      <ScheduleReportModal />
    </div>
  );
};
