'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, Clock, Sparkles, Plus, AlertTriangle, 
  Search, Palette, Moon, Sun, ShieldAlert, CheckCircle2 
} from 'lucide-react';
import { useDayora } from '@/hooks/useDayora';
import { format } from 'date-fns';

interface HeaderProps {
  onOpenQuickAdd: () => void;
  onOpenSearch: () => void;
  onOpenMissedTasks: () => void;
  onOpenNotifications: () => void;
  onOpenThemeStudio: () => void;
  onOpenFocusMode: () => void;
}

export function Header({
  onOpenQuickAdd,
  onOpenSearch,
  onOpenMissedTasks,
  onOpenNotifications,
  onOpenThemeStudio,
  onOpenFocusMode,
}: HeaderProps) {
  const { preferences, tasksOverdue, unreadNotificationsCount } = useDayora();
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(format(now, preferences.timeFormat === '24h' ? 'HH:mm:ss' : 'hh:mm:ss a'));
      setDateStr(format(now, 'EEEE, MMMM d, yyyy'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [preferences.timeFormat]);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-theme-border bg-theme-card/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Live clock & date */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-theme-text-muted uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-theme-primary" />
            <span>{dateStr || 'Loading...'}</span>
          </div>
          <span className="text-sm font-medium text-theme-text-primary tracking-tight">
            {timeStr}
          </span>
        </div>

        {/* Global Quick Search Bar */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-theme-border bg-theme-background text-theme-text-muted hover:text-theme-text-primary hover:border-theme-primary/40 transition-all text-xs font-medium w-36 sm:w-60 shadow-sm"
        >
          <Search className="w-3.5 h-3.5 text-theme-primary" />
          <span className="truncate">Search tasks, tags...</span>
          <kbd className="hidden sm:inline-block ml-auto text-[10px] bg-theme-card px-1.5 py-0.5 rounded border border-theme-border">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Actions & Indicators */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Missed Task Overdue Alert Button */}
        {tasksOverdue.length > 0 && (
          <button
            onClick={onOpenMissedTasks}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all text-xs font-semibold animate-pulse-subtle shadow-sm"
            title={`${tasksOverdue.length} overdue tasks require attention`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{tasksOverdue.length} Missed</span>
          </button>
        )}

        {/* Quick Focus Mode Launch */}
        <button
          onClick={onOpenFocusMode}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-theme-border hover:border-theme-primary/50 text-theme-text-secondary hover:text-theme-primary hover:bg-theme-glow/30 transition-all text-xs font-medium"
          title="Enter Zen Focus Mode"
        >
          <Sparkles className="w-3.5 h-3.5 text-theme-primary" />
          <span>Focus</span>
        </button>

        {/* Theme Customizer Quick Link */}
        <button
          onClick={onOpenThemeStudio}
          className="p-2 rounded-xl text-theme-text-secondary hover:text-theme-primary hover:bg-theme-sidebar border border-transparent hover:border-theme-border transition-all"
          title="Custom Themes & Palette"
        >
          <Palette className="w-4 h-4" />
        </button>

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl text-theme-text-secondary hover:text-theme-primary hover:bg-theme-sidebar border border-transparent hover:border-theme-border transition-all"
          title="Notification Center"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-theme-card animate-pulse" />
          )}
        </button>

        {/* Quick Add Task Button */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-medium text-xs sm:text-sm shadow-subtle hover:shadow transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Task</span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center pl-2 border-l border-theme-border">
          <img
            src={preferences.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
            alt={preferences.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-theme-border shadow-sm cursor-pointer hover:ring-theme-primary transition-all"
            title={`${preferences.name} (${preferences.plan.toUpperCase()} Plan)`}
          />
        </div>
      </div>
    </header>
  );
}
