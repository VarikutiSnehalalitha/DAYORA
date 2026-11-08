'use client';

import React, { useState } from 'react';
import { 
  Bell, X, CheckCheck, Trash2, AlertTriangle, 
  Clock, Sparkles, CheckCircle2, ShieldCheck, Sun 
} from 'lucide-react';
import { useDayora } from '@/hooks/useDayora';
import { AppNotification } from '@/types';
import { format } from 'date-fns';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMissedTasks: () => void;
}

export function NotificationCenter({ isOpen, onClose, onOpenMissedTasks }: NotificationCenterProps) {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    deleteNotification,
    preferences,
    updatePreferences
  } = useDayora();

  const [filter, setFilter] = useState<'all' | 'unread' | 'overdue'>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'overdue') return n.type === 'overdue';
    return true;
  });

  const handleRequestBrowserNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          updatePreferences({ browserNotificationsEnabled: true });
          new Notification('Dayora Notifications Enabled', {
            body: 'You will receive mindful task reminders and missed task alerts.',
            icon: '/favicon.ico',
          });
        }
      });
    }
  };

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'summary_morning':
      case 'summary_evening':
        return <Sun className="w-4 h-4 text-theme-primary" />;
      case 'reminder':
      default:
        return <Clock className="w-4 h-4 text-theme-primary" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-theme-card border-l sm:border border-theme-border w-full max-w-md h-full sm:h-auto sm:max-h-[90vh] sm:rounded-3xl shadow-floating flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-theme-border flex items-center justify-between bg-theme-sidebar/60">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-theme-primary" />
            <h3 className="text-sm font-bold text-theme-text-primary">
              Notification Center
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={markAllNotificationsRead}
              className="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-card transition-all"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-card transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Browser Push Permission Banner */}
        {!preferences.browserNotificationsEnabled && (
          <div className="p-3 bg-theme-glow/20 border-b border-theme-border flex items-center justify-between text-xs gap-2">
            <span className="text-theme-text-secondary leading-tight">
              Enable browser push notifications for real-time alerts.
            </span>
            <button
              onClick={handleRequestBrowserNotifications}
              className="px-2.5 py-1 rounded-lg bg-theme-primary text-white text-[11px] font-semibold hover:bg-theme-primary-hover shadow-subtle whitespace-nowrap"
            >
              Enable
            </button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="px-4 py-2 border-b border-theme-border flex items-center gap-2 text-xs bg-theme-sidebar/30">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${filter === 'all' ? 'bg-theme-card text-theme-primary font-bold shadow-subtle' : 'text-theme-text-muted hover:text-theme-text-primary'}`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${filter === 'unread' ? 'bg-theme-card text-theme-primary font-bold shadow-subtle' : 'text-theme-text-muted hover:text-theme-text-primary'}`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter('overdue')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${filter === 'overdue' ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold' : 'text-theme-text-muted hover:text-theme-text-primary'}`}
          >
            Missed / Overdue
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16 text-xs text-theme-text-muted space-y-2">
              <CheckCircle2 className="w-8 h-8 text-theme-primary/40 mx-auto" />
              <p>All caught up! No notifications to review.</p>
            </div>
          ) : (
            filteredNotifications.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  markNotificationRead(item.id);
                  if (item.type === 'overdue') {
                    onClose();
                    onOpenMissedTasks();
                  }
                }}
                className={`
                  p-3 rounded-2xl border transition-all cursor-pointer space-y-1.5 relative group
                  ${item.read 
                    ? 'bg-theme-sidebar/30 border-theme-border/60 opacity-70' 
                    : item.type === 'overdue'
                      ? 'bg-amber-500/10 border-amber-500/30 shadow-subtle'
                      : 'bg-theme-card border-theme-border shadow-subtle'
                  }
                `}
              >
                {!item.read && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-theme-primary" />
                )}

                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-theme-sidebar">
                    {getNotificationIcon(item.type)}
                  </div>
                  <h4 className="text-xs font-bold text-theme-text-primary truncate pr-4">
                    {item.title}
                  </h4>
                </div>

                <p className="text-xs text-theme-text-secondary leading-relaxed">
                  {item.message}
                </p>

                <div className="flex items-center justify-between pt-1 text-[10px] text-theme-text-muted">
                  <span>{item.createdAt.split('T')[0]}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 transition-opacity"
                    title="Delete notification"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
