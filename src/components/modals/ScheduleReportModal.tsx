import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { X, Calendar, Mail } from 'lucide-react';

export const ScheduleReportModal: React.FC = () => {
  const { isScheduleReportModalOpen, setIsScheduleReportModalOpen, scheduleReport, reports } = useDashboard();
  
  const [reportName, setReportName] = useState(reports[0]?.name || 'Daily Sales Summary');
  const [frequency, setFrequency] = useState('Daily at 06:00 AM');
  const [email, setEmail] = useState('manager@makisushi.com');

  if (!isScheduleReportModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleReport(reportName, frequency, email);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Schedule Report</h3>
              <p className="text-xs text-slate-500">Automated delivery directly to your inbox</p>
            </div>
          </div>
          <button 
            onClick={() => setIsScheduleReportModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Report
            </label>
            <select
              value={reportName}
              onChange={e => setReportName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-orange-500 outline-none bg-white"
            >
              {reports.map(r => (
                <option key={r.id} value={r.name}>{r.name} ({r.type})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Delivery Frequency
            </label>
            <select
              value={frequency}
              onChange={e => setFrequency(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-orange-500 outline-none bg-white"
            >
              <option value="Daily at 06:00 AM">Daily at 06:00 AM (Pre-opening)</option>
              <option value="Daily at 11:30 PM">Daily at 11:30 PM (Post-close)</option>
              <option value="Weekly on Monday 07:00 AM">Weekly on Monday (07:00 AM)</option>
              <option value="Monthly on 1st">Monthly on 1st of each month</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Recipient Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsScheduleReportModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-colors"
            >
              Confirm Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
