'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { store, subscribeToStore } from '@/lib/store';
import { Task, Category, Project, Habit, HabitLog, FocusSession, AppNotification, UserPreferences, ThemeDefinition } from '@/types';
import { format, isToday, isFuture, parseISO, isPast } from 'date-fns';

export function useDayora() {
  const [mounted, setMounted] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    setMounted(true);
    store.init();
    const unsubscribe = subscribeToStore(() => {
      setTick(prev => prev + 1);
    });
    return unsubscribe;
  }, []);

  const tasks = useMemo(() => (mounted ? store.getTasks() : []), [mounted]);
  const categories = useMemo(() => (mounted ? store.getCategories() : []), [mounted]);
  const projects = useMemo(() => (mounted ? store.getProjects() : []), [mounted]);
  const habits = useMemo(() => (mounted ? store.getHabits() : []), [mounted]);
  const habitLogs = useMemo(() => (mounted ? store.getHabitLogs() : []), [mounted]);
  const notifications = useMemo(() => (mounted ? store.getNotifications() : []), [mounted]);
  const focusSessions = useMemo(() => (mounted ? store.getFocusSessions() : []), [mounted]);
  const preferences = useMemo(() => (mounted ? store.getPreferences() : store.getPreferences()), [mounted]);
  const customThemes = useMemo(() => (mounted ? store.getCustomThemes() : []), [mounted]);

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  // Computed subsets
  const tasksToday = useMemo(() => {
    return tasks.filter(t => t.dueDate === todayStr && t.status !== 'cancelled');
  }, [tasks, todayStr]);

  const tasksOverdue = useMemo(() => {
    return tasks.filter(t => t.status === 'overdue');
  }, [tasks]);

  const tasksUpcoming = useMemo(() => {
    return tasks.filter(t => t.dueDate > todayStr && t.status !== 'completed' && t.status !== 'cancelled');
  }, [tasks, todayStr]);

  const tasksCompleted = useMemo(() => {
    return tasks.filter(t => t.status === 'completed');
  }, [tasks]);

  const tasksPending = useMemo(() => {
    return tasks.filter(t => t.status === 'not_started' || t.status === 'in_progress' || t.status === 'waiting');
  }, [tasks]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Intelligent Productivity Score (0 - 100%)
  const productivityScore = useMemo(() => {
    if (tasks.length === 0) return 85;
    const completedWeight = tasksCompleted.length * 20;
    const overduePenalty = tasksOverdue.length * 15;
    const todayTarget = tasksToday.length || 1;
    const todayCompleted = tasksToday.filter(t => t.status === 'completed').length;
    const ratioToday = (todayCompleted / todayTarget) * 40;
    
    // Habit bonus
    const todayLogs = habitLogs.filter(l => l.date === todayStr && l.completed).length;
    const habitBonus = habits.length > 0 ? (todayLogs / habits.length) * 20 : 15;

    let score = Math.round(ratioToday + habitBonus + Math.min(completedWeight, 30) - overduePenalty);
    return Math.max(10, Math.min(100, score));
  }, [tasks, tasksCompleted, tasksOverdue, tasksToday, habitLogs, habits, todayStr]);

  // Store actions
  const createTask = useCallback((taskData: Parameters<typeof store.createTask>[0]) => {
    return store.createTask(taskData);
  }, []);

  const updateTask = useCallback((id: string, updates: Parameters<typeof store.updateTask>[1]) => {
    return store.updateTask(id, updates);
  }, []);

  const toggleTask = useCallback((id: string) => {
    return store.toggleTaskCompleted(id);
  }, []);

  const deleteTask = useCallback((id: string) => {
    return store.deleteTask(id);
  }, []);

  const rescheduleTask = useCallback((id: string, newDueDate: string, newStartTime?: string) => {
    return store.rescheduleTask(id, newDueDate, newStartTime);
  }, []);

  const snoozeTask = useCallback((id: string, minutes?: number) => {
    return store.snoozeTask(id, minutes);
  }, []);

  const toggleHabitDay = useCallback((habitId: string, dateStr: string) => {
    return store.toggleHabitDay(habitId, dateStr);
  }, []);

  const createHabit = useCallback((habitData: Parameters<typeof store.createHabit>[0]) => {
    return store.createHabit(habitData);
  }, []);

  const deleteHabit = useCallback((habitId: string) => {
    return store.deleteHabit(habitId);
  }, []);

  const createProject = useCallback((projectData: Parameters<typeof store.createProject>[0]) => {
    return store.createProject(projectData);
  }, []);

  const updateProject = useCallback((id: string, updates: Parameters<typeof store.updateProject>[1]) => {
    return store.updateProject(id, updates);
  }, []);

  const deleteProject = useCallback((id: string) => {
    return store.deleteProject(id);
  }, []);

  const logFocusSession = useCallback((sessionData: Parameters<typeof store.logFocusSession>[0]) => {
    return store.logFocusSession(sessionData);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    return store.markNotificationAsRead(id);
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    return store.markAllNotificationsRead();
  }, []);

  const deleteNotification = useCallback((id: string) => {
    return store.deleteNotification(id);
  }, []);

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    return store.updatePreferences(updates);
  }, []);

  const saveCustomTheme = useCallback((theme: ThemeDefinition) => {
    return store.saveCustomTheme(theme);
  }, []);

  const resetToDefault = useCallback(() => {
    return store.resetToDefault();
  }, []);

  return {
    mounted,
    tasks,
    categories,
    projects,
    habits,
    habitLogs,
    notifications,
    focusSessions,
    preferences,
    customThemes,
    tasksToday,
    tasksOverdue,
    tasksUpcoming,
    tasksCompleted,
    tasksPending,
    unreadNotificationsCount,
    productivityScore,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    rescheduleTask,
    snoozeTask,
    toggleHabitDay,
    createHabit,
    deleteHabit,
    createProject,
    updateProject,
    deleteProject,
    logFocusSession,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    updatePreferences,
    saveCustomTheme,
    resetToDefault,
  };
}
