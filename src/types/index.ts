export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 
  | 'not_started' 
  | 'in_progress' 
  | 'waiting' 
  | 'completed' 
  | 'overdue' 
  | 'cancelled';

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  order: number;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: string;
}

export interface RecurrenceRule {
  frequency: 'none' | 'daily' | 'weekdays' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
  interval?: number; // e.g. every 2 weeks
  daysOfWeek?: number[]; // 0=Sun, 1=Mon, etc.
  endDate?: string;
  count?: number;
}

export interface ReminderConfig {
  id: string;
  offsetMinutes: number; // e.g. 0 (at time), 5, 10, 15, 30, 60, 1440 (1 day), or custom
  customDateTime?: string;
  channel: 'in_app' | 'browser' | 'both';
  triggered: boolean;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDate?: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  priority: Priority;
  status: TaskStatus;
  categoryId?: string;
  projectId?: string;
  tags: string[];
  estimatedMinutes?: number;
  actualMinutes?: number;
  attachments?: Attachment[];
  subtasks: Subtask[];
  notes?: string;
  recurrence?: RecurrenceRule;
  reminders: ReminderConfig[];
  completedAt?: string;
  isOverdueNotified?: boolean;
  followUpCount?: number;
  lastFollowUpAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  dueDate?: string;
  completed: boolean;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description?: string;
  color: string;
  icon?: string;
  category: string;
  priority: Priority;
  startDate?: string;
  endDate?: string;
  status: 'active' | 'completed' | 'on_hold' | 'archived';
  milestones: ProjectMilestone[];
  createdAt: string;
}

export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  frequency: HabitFrequency;
  targetDaysPerWeek?: number;
  targetCountPerDay?: number;
  color: string;
  icon: string;
  reminderTime?: string;
  createdAt: string;
  archived?: boolean;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  count?: number;
  notes?: string;
}

export interface FocusSession {
  id: string;
  userId: string;
  taskId?: string;
  taskTitle?: string;
  durationMinutes: number;
  type: 'pomodoro' | 'short_break' | 'long_break' | 'deep_work';
  ambientSound?: 'none' | 'rain' | 'forest' | 'coffee_shop' | 'white_noise' | 'waves';
  completed: boolean;
  completedAt: string;
  notes?: string;
}

export type NotificationType = 
  | 'deadline'
  | 'overdue'
  | 'reminder'
  | 'completed'
  | 'recurring'
  | 'habit'
  | 'summary_morning'
  | 'summary_evening'
  | 'system';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  taskId?: string;
  habitId?: string;
  read: boolean;
  urgent?: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface UserPreferences {
  name: string;
  email: string;
  avatarUrl?: string;
  timezone: string;
  dateFormat: 'MM/dd/yyyy' | 'dd/MM/yyyy' | 'yyyy-MM-dd';
  timeFormat: '12h' | '24h';
  plan: 'free' | 'pro';
  browserNotificationsEnabled: boolean;
  soundEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:mm e.g. "22:00"
  quietHoursEnd: string; // HH:mm e.g. "07:00"
  smartFollowUpEnabled: boolean;
  followUpIntervalMinutes: number; // default 15
  themeId: string;
  activeBackgroundTexture: 'none' | 'subtle_dots' | 'linen' | 'paper' | 'gradient';
}

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  secondary: string;
  background: string;
  backgroundCard: string;
  backgroundSidebar: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  accent: string;
  glow: string;
}

export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  family: string;
  mode: 'light' | 'dark' | 'soft_neutral';
  colors: ThemeColors;
  isCustom?: boolean;
}
