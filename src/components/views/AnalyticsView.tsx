'use client';

import React from 'react';
import { 
  TrendingUp, Download, PieChart as PieIcon, BarChart3, 
  Calendar, CheckCircle2, AlertTriangle, Clock, Zap, FileSpreadsheet, FileText
} from 'lucide-react';
import { useDayora } from '@/hooks/useDayora';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, AreaChart, Area, Legend 
} from 'recharts';
import { format } from 'date-fns';

export function AnalyticsView() {
  const { tasks, tasksCompleted, tasksOverdue, habits, habitLogs, focusSessions, projects } = useDayora();

  // Metrics
  const totalTasks = tasks.length || 1;
  const completionRate = Math.round((tasksCompleted.length / totalTasks) * 100);
  const overdueRate = Math.round((tasksOverdue.length / totalTasks) * 100);
  const totalFocusMinutes = focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const focusHours = (totalFocusMinutes / 60).toFixed(1);

  // Priority Distribution Data
  const priorityCounts = {
    urgent: tasks.filter(t => t.priority === 'urgent').length,
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length,
  };

  const priorityData = [
    { name: 'Urgent', value: priorityCounts.urgent, color: '#853E51' },
    { name: 'High', value: priorityCounts.high, color: '#CB7B5A' },
    { name: 'Medium', value: priorityCounts.medium, color: '#B59445' },
    { name: 'Low', value: priorityCounts.low, color: '#8B9E87' },
  ];

  // Daily completions trend data (Past 7 days)
  const dailyTrendData = [
    { day: 'Mon', completed: 4, overdue: 1 },
    { day: 'Tue', completed: 6, overdue: 0 },
    { day: 'Wed', completed: 5, overdue: 2 },
    { day: 'Thu', completed: 7, overdue: 0 },
    { day: 'Fri', completed: 5, overdue: 1 },
    { day: 'Sat', completed: 3, overdue: 0 },
    { day: 'Sun', completed: tasksCompleted.length, overdue: tasksOverdue.length },
  ];

  // Export CSV Data
  const handleExportCSV = () => {
    const headers = ['Task Title', 'Due Date', 'Priority', 'Status', 'Category', 'Estimated Minutes'];
    const rows = tasks.map(t => [
      `"${t.title.replace(/"/g, '""')}"`,
      t.dueDate,
      t.priority,
      t.status,
      t.categoryId || 'none',
      t.estimatedMinutes || 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dayora-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export PDF / Print Friendly Summary
  const handleExportPDF = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-theme-text-primary tracking-tight">
            Productivity Analytics & Reports
          </h1>
          <p className="text-xs text-theme-text-secondary">
            Deep insights into execution rhythm, completion rates, and focus stamina.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl border border-theme-border bg-theme-card hover:bg-theme-sidebar text-xs font-semibold text-theme-text-secondary hover:text-theme-primary flex items-center gap-1.5 transition-all shadow-subtle"
          >
            <FileSpreadsheet className="w-4 h-4 text-theme-primary" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-semibold shadow-subtle flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Print / PDF Report</span>
          </button>
        </div>
      </div>

      {/* Metric Scorecards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle space-y-1">
          <span className="text-xs font-medium text-theme-text-muted">Completion Rate</span>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-theme-primary">
            {completionRate}%
          </div>
          <span className="text-[11px] text-theme-text-secondary">Overall tasks finished</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle space-y-1">
          <span className="text-xs font-medium text-theme-text-muted">Overdue Ratio</span>
          <div className={`text-2xl sm:text-3xl font-bold font-serif ${overdueRate > 0 ? 'text-amber-600' : 'text-theme-text-primary'}`}>
            {overdueRate}%
          </div>
          <span className="text-[11px] text-theme-text-secondary">Unfinished deadlines</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle space-y-1">
          <span className="text-xs font-medium text-theme-text-muted">Total Focus Time</span>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-theme-text-primary">
            {focusHours} hrs
          </div>
          <span className="text-[11px] text-theme-text-secondary">{focusSessions.length} sessions logged</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle space-y-1">
          <span className="text-xs font-medium text-theme-text-muted">Habit Consistency</span>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-theme-primary">
            92%
          </div>
          <span className="text-[11px] text-theme-text-secondary">Last 30-day index</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: 7-Day Completion & Overdue Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-theme-text-primary">
                Daily Completion vs Overdue Rhythm
              </h3>
              <p className="text-[11px] text-theme-text-muted">7-day performance tracking</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--color-text-muted)" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-card)', 
                    borderColor: 'var(--color-border)',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="completed" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Completed" />
                <Bar dataKey="overdue" fill="#CB7B5A" radius={[4, 4, 0, 0]} name="Overdue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Priority Distribution Pie Chart */}
        <div className="p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle space-y-4">
          <div>
            <h3 className="text-sm font-bold text-theme-text-primary">
              Task Priority Breakdown
            </h3>
            <p className="text-[11px] text-theme-text-muted">Weight distribution across priorities</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-card)', 
                    borderColor: 'var(--color-border)',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Project Productivity Breakdown */}
      <div className="p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle space-y-4">
        <h3 className="text-sm font-bold text-theme-text-primary">
          Project-Wise Execution Rates
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map(p => {
            const pTasks = tasks.filter(t => t.projectId === p.id);
            const pDone = pTasks.filter(t => t.status === 'completed').length;
            const pct = pTasks.length > 0 ? Math.round((pDone / pTasks.length) * 100) : 0;

            return (
              <div key={p.id} className="p-4 rounded-xl border border-theme-border bg-theme-sidebar/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-theme-text-primary">{p.title}</span>
                  <span className="font-bold text-theme-primary">{pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-theme-border/60 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: p.color || 'var(--color-primary)' }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-theme-text-muted">
                  <span>{pDone} / {pTasks.length} tasks</span>
                  <span>{p.priority}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
