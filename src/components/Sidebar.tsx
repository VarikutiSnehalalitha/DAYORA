'use client';

import React from 'react';
import { 
  LayoutDashboard, CheckSquare, Calendar, Clock, 
  FolderKanban, Sparkles, TrendingUp, Bell, 
  Settings, Palette, Tag, Target, Zap, ChevronRight, Crown
} from 'lucide-react';
import { useDayora } from '@/hooks/useDayora';

export type NavigationTab = 
  | 'dashboard'
  | 'tasks'
  | 'today'
  | 'upcoming'
  | 'calendar'
  | 'projects'
  | 'habits'
  | 'focus'
  | 'analytics'
  | 'themes'
  | 'settings';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenUpgradeModal: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  onOpenUpgradeModal,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const { tasksToday, tasksOverdue, preferences } = useDayora();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'today', label: 'Today', icon: Clock, badge: tasksToday.length > 0 ? tasksToday.length : undefined },
    { id: 'upcoming', label: 'Upcoming', icon: Calendar },
    { id: 'tasks', label: 'All Tasks', icon: CheckSquare, badge: tasksOverdue.length > 0 ? `${tasksOverdue.length} overdue` : undefined, badgeColor: 'bg-amber-500/20 text-amber-700 dark:text-amber-300' },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'habits', label: 'Habits', icon: Target },
    { id: 'focus', label: 'Focus Mode', icon: Zap },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'themes', label: 'Theme Studio', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity" 
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-theme-sidebar border-r border-theme-border flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-theme-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-theme-primary flex items-center justify-center text-white shadow-subtle ring-2 ring-theme-glow">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-lg font-bold tracking-tight text-theme-text-primary">
                  Dayora
                </span>
                <span className="text-[10px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-theme-primary/10 text-theme-primary border border-theme-primary/20">
                  {preferences.plan}
                </span>
              </div>
              <p className="text-[11px] text-theme-text-muted font-medium truncate max-w-[130px]">
                Make Time for What Matters
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase text-theme-text-muted">
            Workspace
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id as NavigationTab);
                  onCloseMobile();
                }}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all group
                  ${isActive 
                    ? 'bg-theme-card text-theme-primary font-semibold shadow-subtle border border-theme-border/80' 
                    : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-card/60'
                  }
                `}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-theme-primary' : 'text-theme-text-muted'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-theme-glow text-theme-primary'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Pro Plan Upgrade Callout & User Card */}
        <div className="p-3 border-t border-theme-border space-y-2.5">
          {preferences.plan === 'free' ? (
            <div 
              onClick={onOpenUpgradeModal}
              className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/10 via-theme-glow/30 to-amber-500/5 border border-amber-500/20 cursor-pointer hover:border-amber-500/40 transition-all shadow-subtle group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-200">
                  <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Unlock Dayora Pro</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-theme-text-secondary leading-tight">
                Unlimited themes, smart missed-task escalations & calendar sync.
              </p>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-theme-card/60 border border-theme-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-theme-primary" />
                <span className="text-xs font-semibold text-theme-text-primary">Pro Active</span>
              </div>
              <span className="text-[10px] font-medium text-theme-text-muted">All Features On</span>
            </div>
          )}

          {/* User profile capsule */}
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-theme-text-secondary truncate">
                {preferences.name}
              </span>
            </div>
            <span className="text-[10px] text-theme-text-muted">
              {preferences.timezone.split(' ')[0]}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
