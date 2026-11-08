'use client';

import React, { useState } from 'react';
import { Sidebar, NavigationTab } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { DashboardView } from '@/components/views/DashboardView';
import { TasksView } from '@/components/views/TasksView';
import { CalendarView } from '@/components/views/CalendarView';
import { ProjectsView } from '@/components/views/ProjectsView';
import { HabitsView } from '@/components/views/HabitsView';
import { FocusModeView } from '@/components/views/FocusModeView';
import { AnalyticsView } from '@/components/views/AnalyticsView';
import { ThemeStudioView } from '@/components/views/ThemeStudioView';
import { SettingsView } from '@/components/views/SettingsView';
import { MissedTasksModal } from '@/components/MissedTasksModal';
import { TaskCreateModal } from '@/components/TaskCreateModal';
import { NotificationCenter } from '@/components/NotificationCenter';
import { SearchModal } from '@/components/SearchModal';
import { UpgradeModal } from '@/components/UpgradeModal';
import { useDayora } from '@/hooks/useDayora';
import { Menu } from 'lucide-react';

export function MainLayout() {
  const { preferences } = useDayora();
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modals
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isMissedTasksOpen, setIsMissedTasksOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [quickAddDate, setQuickAddDate] = useState<string | undefined>(undefined);

  const handleOpenQuickAdd = (date?: string) => {
    setQuickAddDate(date);
    setIsQuickAddOpen(true);
  };

  // Determine surface texture class
  const textureClass = preferences.activeBackgroundTexture === 'subtle_dots'
    ? 'texture-subtle-dots'
    : preferences.activeBackgroundTexture === 'linen'
      ? 'texture-linen'
      : preferences.activeBackgroundTexture === 'paper'
        ? 'texture-paper'
        : preferences.activeBackgroundTexture === 'gradient'
          ? 'texture-gradient'
          : '';

  return (
    <div className={`min-h-screen flex bg-theme-background text-theme-text-primary ${textureClass} transition-colors`}>
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenUpgradeModal={() => setIsUpgradeOpen(true)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <div className="flex items-center">
          {/* Mobile hamburger trigger */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-3 pl-4 text-theme-text-primary hover:bg-theme-sidebar"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <Header
              onOpenQuickAdd={() => handleOpenQuickAdd()}
              onOpenSearch={() => setIsSearchOpen(true)}
              onOpenMissedTasks={() => setIsMissedTasksOpen(true)}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onOpenThemeStudio={() => setCurrentTab('themes')}
              onOpenFocusMode={() => setCurrentTab('focus')}
            />
          </div>
        </div>

        {/* View Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              onOpenQuickAdd={() => handleOpenQuickAdd()}
              onOpenMissedTasks={() => setIsMissedTasksOpen(true)}
              onSelectTaskTab={() => setCurrentTab('tasks')}
              onSelectHabitTab={() => setCurrentTab('habits')}
              onOpenFocusMode={() => setCurrentTab('focus')}
            />
          )}

          {currentTab === 'tasks' && (
            <TasksView
              onOpenQuickAdd={() => handleOpenQuickAdd()}
              onOpenMissedTasks={() => setIsMissedTasksOpen(true)}
            />
          )}

          {currentTab === 'today' && (
            <TasksView
              onOpenQuickAdd={() => handleOpenQuickAdd()}
              onOpenMissedTasks={() => setIsMissedTasksOpen(true)}
            />
          )}

          {currentTab === 'upcoming' && (
            <TasksView
              onOpenQuickAdd={() => handleOpenQuickAdd()}
              onOpenMissedTasks={() => setIsMissedTasksOpen(true)}
            />
          )}

          {currentTab === 'calendar' && (
            <CalendarView
              onOpenQuickAdd={(date) => handleOpenQuickAdd(date)}
              onOpenMissedTasks={() => setIsMissedTasksOpen(true)}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectsView
              onOpenQuickAdd={() => handleOpenQuickAdd()}
            />
          )}

          {currentTab === 'habits' && (
            <HabitsView />
          )}

          {currentTab === 'focus' && (
            <FocusModeView />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView />
          )}

          {currentTab === 'themes' && (
            <ThemeStudioView />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              onOpenUpgradeModal={() => setIsUpgradeOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <TaskCreateModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        initialDate={quickAddDate}
      />

      <MissedTasksModal
        isOpen={isMissedTasksOpen}
        onClose={() => setIsMissedTasksOpen(false)}
      />

      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onOpenMissedTasks={() => setIsMissedTasksOpen(true)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />
    </div>
  );
}
