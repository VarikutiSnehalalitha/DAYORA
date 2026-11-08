'use client';

import { 
  Task, Category, Project, Habit, HabitLog, 
  FocusSession, AppNotification, UserPreferences, ThemeDefinition 
} from '@/types';
import { 
  INITIAL_PREFERENCES, INITIAL_CATEGORIES, INITIAL_PROJECTS, 
  INITIAL_TASKS, INITIAL_HABITS, INITIAL_HABIT_LOGS, 
  INITIAL_NOTIFICATIONS, INITIAL_FOCUS_SESSIONS 
} from './initialData';
import { PREDEFINED_THEMES } from './palette';
import { playChime } from './audio';
import { format, isBefore, parseISO, addHours, addDays, startOfDay } from 'date-fns';

const STORAGE_KEYS = {
  PREFERENCES: 'dayora_preferences_v1',
  TASKS: 'dayora_tasks_v1',
  CATEGORIES: 'dayora_categories_v1',
  PROJECTS: 'dayora_projects_v1',
  HABITS: 'dayora_habits_v1',
  HABIT_LOGS: 'dayora_habit_logs_v1',
  NOTIFICATIONS: 'dayora_notifications_v1',
  FOCUS_SESSIONS: 'dayora_focus_sessions_v1',
  CUSTOM_THEMES: 'dayora_custom_themes_v1',
};

type Listener = () => void;
const listeners = new Set<Listener>();

function notifyListeners() {
  listeners.forEach(cb => {
    try {
      cb();
    } catch (e) {
      console.error('Error notifying listener:', e);
    }
  });
}

export function subscribeToStore(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// In-memory cache backed by LocalStorage
class DayoraDataStore {
  private preferences: UserPreferences = INITIAL_PREFERENCES;
  private tasks: Task[] = INITIAL_TASKS;
  private categories: Category[] = INITIAL_CATEGORIES;
  private projects: Project[] = INITIAL_PROJECTS;
  private habits: Habit[] = INITIAL_HABITS;
  private habitLogs: HabitLog[] = INITIAL_HABIT_LOGS;
  private notifications: AppNotification[] = INITIAL_NOTIFICATIONS;
  private focusSessions: FocusSession[] = INITIAL_FOCUS_SESSIONS;
  private customThemes: ThemeDefinition[] = [];
  private isInitialized = false;
  private checkerInterval: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  public init() {
    if (this.isInitialized) return;
    try {
      const p = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (p) this.preferences = JSON.parse(p);

      const t = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (t) this.tasks = JSON.parse(t);

      const c = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (c) this.categories = JSON.parse(c);

      const pr = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (pr) this.projects = JSON.parse(pr);

      const h = localStorage.getItem(STORAGE_KEYS.HABITS);
      if (h) this.habits = JSON.parse(h);

      const hl = localStorage.getItem(STORAGE_KEYS.HABIT_LOGS);
      if (hl) this.habitLogs = JSON.parse(hl);

      const n = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (n) this.notifications = JSON.parse(n);

      const f = localStorage.getItem(STORAGE_KEYS.FOCUS_SESSIONS);
      if (f) this.focusSessions = JSON.parse(f);

      const ct = localStorage.getItem(STORAGE_KEYS.CUSTOM_THEMES);
      if (ct) this.customThemes = JSON.parse(ct);

      this.isInitialized = true;
      this.applyTheme(this.preferences.themeId);
      this.startIntelligentReminderEngine();
    } catch (err) {
      console.warn('LocalStorage init fallback:', err);
    }
  }

  // --- Theme Management ---
  public applyTheme(themeId: string) {
    if (typeof document === 'undefined') return;
    const allThemes = [...PREDEFINED_THEMES, ...this.customThemes];
    const theme = allThemes.find(t => t.id === themeId) || PREDEFINED_THEMES[0];

    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-primary-hover', theme.colors.primaryHover);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-bg', theme.colors.background);
    root.style.setProperty('--color-card', theme.colors.backgroundCard);
    root.style.setProperty('--color-sidebar', theme.colors.backgroundSidebar);
    root.style.setProperty('--color-text-primary', theme.colors.textPrimary);
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--color-text-muted', theme.colors.textMuted);
    root.style.setProperty('--color-border', theme.colors.border);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-glow', theme.colors.glow);

    if (theme.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  // --- Intelligent Missed Task & Reminder Engine ---
  private startIntelligentReminderEngine() {
    if (this.checkerInterval) clearInterval(this.checkerInterval);

    // Initial check on load
    this.checkDeadlinesAndReminders();

    // Check periodically every 20 seconds
    this.checkerInterval = setInterval(() => {
      this.checkDeadlinesAndReminders();
    }, 20000);
  }

  private isQuietHours(): boolean {
    if (!this.preferences.quietHoursEnabled) return false;
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = this.preferences.quietHoursStart.split(':').map(Number);
    const [endH, endM] = this.preferences.quietHoursEnd.split(':').map(Number);
    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;

    if (startMins > endMins) {
      // Overnight (e.g. 22:00 to 07:00)
      return currentMins >= startMins || currentMins < endMins;
    } else {
      return currentMins >= startMins && currentMins < endMins;
    }
  }

  public checkDeadlinesAndReminders() {
    const now = new Date();
    let hasChanges = false;
    const quiet = this.isQuietHours();

    this.tasks = this.tasks.map(task => {
      if (task.status === 'completed' || task.status === 'cancelled') {
        return task;
      }

      // Construct deadline DateTime
      const datePart = task.dueDate;
      const timePart = task.endTime || task.startTime || '23:59';
      let deadlineDate: Date;
      try {
        deadlineDate = parseISO(`${datePart}T${timePart}:00`);
      } catch {
        deadlineDate = parseISO(`${datePart}T23:59:00`);
      }

      // Check for missed deadline
      if (isBefore(deadlineDate, now)) {
        if (task.status !== 'overdue') {
          hasChanges = true;
          task = {
            ...task,
            status: 'overdue',
            isOverdueNotified: true,
            followUpCount: 1,
            lastFollowUpAt: now.toISOString(),
          };

          // Generate Overdue Notification
          this.createNotification({
            type: 'overdue',
            title: 'Missed Task: ' + task.title,
            message: `This task deadline passed at ${timePart}. Would you like to reschedule or mark it completed?`,
            taskId: task.id,
            urgent: true,
          });

          if (!quiet && this.preferences.soundEnabled) {
            playChime('warning');
          }
        } else if (this.preferences.smartFollowUpEnabled && task.followUpCount && task.followUpCount < 3) {
          // Smart follow up escalation (15m, 1h)
          if (task.lastFollowUpAt) {
            const lastFollowUp = parseISO(task.lastFollowUpAt);
            const diffMinutes = (now.getTime() - lastFollowUp.getTime()) / (1000 * 60);
            if (diffMinutes >= this.preferences.followUpIntervalMinutes) {
              hasChanges = true;
              task = {
                ...task,
                followUpCount: task.followUpCount + 1,
                lastFollowUpAt: now.toISOString(),
              };

              this.createNotification({
                type: 'overdue',
                title: `Follow-up: "${task.title}" is still pending`,
                message: `You planned to finish this task earlier. Make time to complete it or reschedule for tomorrow.`,
                taskId: task.id,
                urgent: false,
              });

              if (!quiet && this.preferences.soundEnabled) {
                playChime('reminder');
              }
            }
          }
        }
      }

      // Check upcoming reminders for active tasks
      if (task.status !== 'overdue' && task.reminders && task.reminders.length > 0) {
        const updatedReminders = task.reminders.map(rem => {
          if (rem.triggered) return rem;
          const reminderTime = new Date(deadlineDate.getTime() - rem.offsetMinutes * 60000);
          if (isBefore(reminderTime, now)) {
            hasChanges = true;
            // Trigger reminder
            this.createNotification({
              type: 'reminder',
              title: `Reminder: ${task.title}`,
              message: `Your task is approaching in ${rem.offsetMinutes === 0 ? 'now' : `${rem.offsetMinutes} minutes`}.`,
              taskId: task.id,
              urgent: task.priority === 'urgent' || task.priority === 'high',
            });
            if (!quiet && this.preferences.soundEnabled) {
              playChime('reminder');
            }
            return { ...rem, triggered: true };
          }
          return rem;
        });
        task = { ...task, reminders: updatedReminders };
      }

      return task;
    });

    if (hasChanges) {
      this.saveTasks();
      notifyListeners();
    }
  }

  // --- Task Methods ---
  public getTasks(): Task[] {
    return [...this.tasks];
  }

  public getTask(id: string): Task | undefined {
    return this.tasks.find(t => t.id === id);
  }

  public createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Task {
    const newTask: Task = {
      ...taskData,
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      userId: 'user-default',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: taskData.status || 'not_started',
      subtasks: taskData.subtasks || [],
      reminders: taskData.reminders || [],
      tags: taskData.tags || [],
    };
    this.tasks = [newTask, ...this.tasks];
    this.saveTasks();

    if (this.preferences.soundEnabled && !this.isQuietHours()) {
      playChime('success');
    }

    notifyListeners();
    return newTask;
  }

  public updateTask(id: string, updates: Partial<Task>): Task | null {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;

    const updatedTask = {
      ...this.tasks[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.tasks[idx] = updatedTask;
    this.saveTasks();
    notifyListeners();
    return updatedTask;
  }

  public toggleTaskCompleted(id: string): Task | null {
    const task = this.getTask(id);
    if (!task) return null;

    const newCompleted = task.status !== 'completed';
    const updatedStatus = newCompleted ? 'completed' : 'not_started';
    const completedAt = newCompleted ? new Date().toISOString() : undefined;

    const updated = this.updateTask(id, {
      status: updatedStatus,
      completedAt,
    });

    if (newCompleted) {
      if (this.preferences.soundEnabled && !this.isQuietHours()) {
        playChime('success');
      }
      this.createNotification({
        type: 'completed',
        title: 'Task Completed! ✨',
        message: `Great momentum! You completed "${task.title}".`,
        taskId: task.id,
      });
    }

    return updated;
  }

  public deleteTask(id: string): boolean {
    const initialLen = this.tasks.length;
    this.tasks = this.tasks.filter(t => t.id !== id);
    if (this.tasks.length !== initialLen) {
      this.saveTasks();
      notifyListeners();
      return true;
    }
    return false;
  }

  public rescheduleTask(id: string, newDueDate: string, newStartTime?: string): Task | null {
    const task = this.getTask(id);
    if (!task) return null;

    const updated = this.updateTask(id, {
      dueDate: newDueDate,
      startTime: newStartTime || task.startTime,
      status: 'not_started',
      isOverdueNotified: false,
      followUpCount: 0,
      reminders: task.reminders.map(r => ({ ...r, triggered: false })),
    });

    this.createNotification({
      type: 'system',
      title: 'Task Rescheduled',
      message: `"${task.title}" rescheduled to ${newDueDate}${newStartTime ? ` at ${newStartTime}` : ''}.`,
      taskId: id,
    });

    return updated;
  }

  public snoozeTask(id: string, minutes: number = 60): Task | null {
    const task = this.getTask(id);
    if (!task) return null;

    const now = new Date();
    const newTime = addHours(now, minutes / 60);
    const newDueDate = format(newTime, 'yyyy-MM-dd');
    const newStartTime = format(newTime, 'HH:mm');

    return this.rescheduleTask(id, newDueDate, newStartTime);
  }

  private saveTasks() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(this.tasks));
    }
  }

  // --- Habit Methods ---
  public getHabits(): Habit[] {
    return [...this.habits];
  }

  public getHabitLogs(): HabitLog[] {
    return [...this.habitLogs];
  }

  public toggleHabitDay(habitId: string, dateStr: string): boolean {
    const existingIdx = this.habitLogs.findIndex(l => l.habitId === habitId && l.date === dateStr);
    let isCompleted = true;

    if (existingIdx >= 0) {
      isCompleted = !this.habitLogs[existingIdx].completed;
      this.habitLogs[existingIdx].completed = isCompleted;
    } else {
      this.habitLogs.push({
        id: `log-${habitId}-${dateStr}-${Date.now()}`,
        habitId,
        date: dateStr,
        completed: true,
      });
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.HABIT_LOGS, JSON.stringify(this.habitLogs));
    }

    if (isCompleted && this.preferences.soundEnabled && !this.isQuietHours()) {
      playChime('success');
    }

    notifyListeners();
    return isCompleted;
  }

  public createHabit(habitData: Omit<Habit, 'id' | 'createdAt' | 'userId'>): Habit {
    const newHabit: Habit = {
      ...habitData,
      id: 'habit-' + Date.now(),
      userId: 'user-default',
      createdAt: new Date().toISOString(),
    };
    this.habits = [...this.habits, newHabit];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(this.habits));
    }
    notifyListeners();
    return newHabit;
  }

  public deleteHabit(habitId: string) {
    this.habits = this.habits.filter(h => h.id !== habitId);
    this.habitLogs = this.habitLogs.filter(l => l.habitId !== habitId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(this.habits));
      localStorage.setItem(STORAGE_KEYS.HABIT_LOGS, JSON.stringify(this.habitLogs));
    }
    notifyListeners();
  }

  // --- Projects Methods ---
  public getProjects(): Project[] {
    return [...this.projects];
  }

  public createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'userId'>): Project {
    const newProject: Project = {
      ...projectData,
      id: 'proj-' + Date.now(),
      userId: 'user-default',
      createdAt: new Date().toISOString(),
      milestones: projectData.milestones || [],
    };
    this.projects = [...this.projects, newProject];
    this.saveProjects();
    notifyListeners();
    return newProject;
  }

  public updateProject(id: string, updates: Partial<Project>): Project | null {
    const idx = this.projects.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.projects[idx] = { ...this.projects[idx], ...updates };
    this.saveProjects();
    notifyListeners();
    return this.projects[idx];
  }

  public deleteProject(id: string) {
    this.projects = this.projects.filter(p => p.id !== id);
    this.saveProjects();
    notifyListeners();
  }

  private saveProjects() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(this.projects));
    }
  }

  // --- Categories Methods ---
  public getCategories(): Category[] {
    return [...this.categories];
  }

  public createCategory(category: Category) {
    this.categories.push(category);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(this.categories));
    }
    notifyListeners();
  }

  // --- Focus Sessions ---
  public getFocusSessions(): FocusSession[] {
    return [...this.focusSessions];
  }

  public logFocusSession(session: Omit<FocusSession, 'id' | 'userId' | 'completedAt'>): FocusSession {
    const newSession: FocusSession = {
      ...session,
      id: 'focus-' + Date.now(),
      userId: 'user-default',
      completedAt: new Date().toISOString(),
    };
    this.focusSessions = [newSession, ...this.focusSessions];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.FOCUS_SESSIONS, JSON.stringify(this.focusSessions));
    }
    if (this.preferences.soundEnabled && !this.isQuietHours()) {
      playChime('success');
    }
    notifyListeners();
    return newSession;
  }

  // --- Notification Center ---
  public getNotifications(): AppNotification[] {
    return [...this.notifications];
  }

  public createNotification(data: Omit<AppNotification, 'id' | 'createdAt' | 'userId' | 'read'>) {
    const newNotif: AppNotification = {
      ...data,
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      userId: 'user-default',
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications = [newNotif, ...this.notifications];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
    }
    notifyListeners();
  }

  public markNotificationAsRead(id: string) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
      }
      notifyListeners();
    }
  }

  public markAllNotificationsRead() {
    this.notifications.forEach(n => { n.read = true; });
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
    }
    notifyListeners();
  }

  public deleteNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
    }
    notifyListeners();
  }

  // --- Preferences & Theme Customization ---
  public getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  public updatePreferences(updates: Partial<UserPreferences>) {
    this.preferences = { ...this.preferences, ...updates };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(this.preferences));
    }
    if (updates.themeId) {
      this.applyTheme(updates.themeId);
    }
    notifyListeners();
  }

  public getCustomThemes(): ThemeDefinition[] {
    return [...this.customThemes];
  }

  public saveCustomTheme(theme: ThemeDefinition) {
    const existingIdx = this.customThemes.findIndex(t => t.id === theme.id);
    if (existingIdx >= 0) {
      this.customThemes[existingIdx] = theme;
    } else {
      this.customThemes.push(theme);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_THEMES, JSON.stringify(this.customThemes));
    }
    this.updatePreferences({ themeId: theme.id });
    notifyListeners();
  }

  public resetToDefault() {
    this.preferences = { ...INITIAL_PREFERENCES };
    this.tasks = [...INITIAL_TASKS];
    this.projects = [...INITIAL_PROJECTS];
    this.habits = [...INITIAL_HABITS];
    this.habitLogs = [...INITIAL_HABIT_LOGS];
    this.notifications = [...INITIAL_NOTIFICATIONS];
    this.focusSessions = [...INITIAL_FOCUS_SESSIONS];
    this.customThemes = [];

    if (typeof window !== 'undefined') {
      Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    }
    this.applyTheme(INITIAL_PREFERENCES.themeId);
    notifyListeners();
  }
}

export const store = new DayoraDataStore();
