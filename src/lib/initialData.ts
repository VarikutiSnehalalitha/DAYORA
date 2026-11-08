import { format, subDays, addDays } from 'date-fns';
import { Task, Category, Project, Habit, HabitLog, FocusSession, AppNotification, UserPreferences } from '@/types';

const today = new Date();
const todayStr = format(today, 'yyyy-MM-dd');
const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');
const tomorrowStr = format(addDays(today, 1), 'yyyy-MM-dd');
const inTwoDaysStr = format(addDays(today, 2), 'yyyy-MM-dd');
const inFourDaysStr = format(addDays(today, 4), 'yyyy-MM-dd');

export const INITIAL_PREFERENCES: UserPreferences = {
  name: 'Elena Vance',
  email: 'elena.vance@dayora.app',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  timezone: 'America/New_York (GMT-5)',
  dateFormat: 'MM/dd/yyyy',
  timeFormat: '12h',
  plan: 'pro',
  browserNotificationsEnabled: true,
  soundEnabled: true,
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  smartFollowUpEnabled: true,
  followUpIntervalMinutes: 15,
  themeId: 'emerald-garden',
  activeBackgroundTexture: 'subtle_dots',
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-work', name: 'Work & Strategy', color: '#529871', icon: 'Briefcase', description: 'Professional priorities, roadmap & architecture' },
  { id: 'cat-wellness', name: 'Personal & Wellness', color: '#8B9E87', icon: 'Smile', description: 'Mindfulness, sleep hygiene & personal life' },
  { id: 'cat-creative', name: 'Creative Studio', color: '#6F5977', icon: 'Sparkles', description: 'Design concepts, writing & artistic ventures' },
  { id: 'cat-fitness', name: 'Health & Fitness', color: '#4F8F99', icon: 'Activity', description: 'Cardio, strength, nutrition & hydration' },
  { id: 'cat-learning', name: 'Deep Learning', color: '#B59445', icon: 'BookOpen', description: 'Books, research papers & technical skill acquisition' },
  { id: 'cat-finance', name: 'Finance & Wealth', color: '#7B5945', icon: 'PieChart', description: 'Budgets, investments & expense tracking' },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-dayora',
    userId: 'user-default',
    title: 'Dayora SaaS Ecosystem Launch',
    description: 'Developing our flagship intelligent task management and mindful productivity platform.',
    color: '#529871',
    category: 'Work & Strategy',
    priority: 'urgent',
    startDate: yesterdayStr,
    endDate: inFourDaysStr,
    status: 'active',
    createdAt: yesterdayStr,
    milestones: [
      { id: 'm-1', projectId: 'proj-dayora', title: 'Curate 100-Color Architectural Palette', completed: true },
      { id: 'm-2', projectId: 'proj-dayora', title: 'Implement Smart Overdue & Missed-Task Engine', completed: true },
      { id: 'm-3', projectId: 'proj-dayora', title: 'Interactive Calendar & Drag-and-Drop Scheduling', completed: false, dueDate: tomorrowStr },
      { id: 'm-4', projectId: 'proj-dayora', title: 'Zen Focus Mode with Ambient Soundscapes', completed: false, dueDate: inTwoDaysStr },
    ],
  },
  {
    id: 'proj-wellness',
    userId: 'user-default',
    title: 'Mind & Body Rejuvenation',
    description: 'Cultivating sustainable daily restorative routines, clean nutrition, and cognitive clarity.',
    color: '#4F8F99',
    category: 'Health & Fitness',
    priority: 'high',
    startDate: subDays(today, 10).toISOString().split('T')[0],
    endDate: addDays(today, 20).toISOString().split('T')[0],
    status: 'active',
    createdAt: yesterdayStr,
    milestones: [
      { id: 'm-w1', projectId: 'proj-wellness', title: 'Establish 20-minute morning breathwork cadence', completed: true },
      { id: 'm-w2', projectId: 'proj-wellness', title: 'Complete 30 consecutive days of 2.5L water tracking', completed: false, dueDate: inFourDaysStr },
    ],
  },
  {
    id: 'proj-reading',
    userId: 'user-default',
    title: 'Architectural Philosophy & Systems',
    description: 'Reading essential literature on complex adaptive systems, timeless aesthetics, and mindful craft.',
    color: '#B59445',
    category: 'Deep Learning',
    priority: 'medium',
    startDate: subDays(today, 5).toISOString().split('T')[0],
    endDate: addDays(today, 15).toISOString().split('T')[0],
    status: 'active',
    createdAt: yesterdayStr,
    milestones: [
      { id: 'm-r1', projectId: 'proj-reading', title: 'Finish Christopher Alexander’s Timeless Way', completed: true },
      { id: 'm-r2', projectId: 'proj-reading', title: 'Synthesize notes into knowledge graph', completed: false, dueDate: tomorrowStr },
    ],
  },
];

export const INITIAL_TASKS: Task[] = [
  // 1. Missed / Overdue Task (demonstrates intelligent missed task engine!)
  {
    id: 'task-overdue-1',
    userId: 'user-default',
    title: 'Review Q3 operational budget allocation with stakeholders',
    description: 'Ensure quarterly software licenses and engineering cloud allowances match projection forecasts.',
    dueDate: yesterdayStr,
    startTime: '16:00',
    endTime: '17:00',
    priority: 'high',
    status: 'overdue',
    categoryId: 'cat-finance',
    projectId: 'proj-dayora',
    tags: ['budget', 'stakeholders', 'finance'],
    estimatedMinutes: 60,
    subtasks: [
      { id: 'sub-1', taskId: 'task-overdue-1', title: 'Export AWS cloud compute breakdown', completed: true, order: 0 },
      { id: 'sub-2', taskId: 'task-overdue-1', title: 'Draft memo for executive finance committee', completed: false, order: 1 },
      { id: 'sub-3', taskId: 'task-overdue-1', title: 'Schedule 15-min sign-off briefing', completed: false, order: 2 },
    ],
    reminders: [
      { id: 'rem-ov-1', offsetMinutes: 30, channel: 'both', triggered: true },
    ],
    isOverdueNotified: false,
    followUpCount: 1,
    lastFollowUpAt: yesterdayStr + 'T17:15:00',
    createdAt: subDays(today, 2).toISOString(),
    updatedAt: yesterdayStr,
  },
  // 2. Today: In Progress Task
  {
    id: 'task-today-1',
    userId: 'user-default',
    title: 'Complete Dayora theme customization preview engine',
    description: 'Refine theme selector, custom hex color pickers, and background texture live preview switch.',
    dueDate: todayStr,
    startTime: '10:00',
    endTime: '12:30',
    priority: 'urgent',
    status: 'in_progress',
    categoryId: 'cat-work',
    projectId: 'proj-dayora',
    tags: ['design-system', 'ui', 'themes'],
    estimatedMinutes: 150,
    actualMinutes: 45,
    subtasks: [
      { id: 'sub-t1', taskId: 'task-today-1', title: 'Wire up 100-color palette palette selector', completed: true, order: 0 },
      { id: 'sub-t2', taskId: 'task-today-1', title: 'Add real-time CSS variable injector', completed: true, order: 1 },
      { id: 'sub-t3', taskId: 'task-today-1', title: 'Build preview card and live reset modal', completed: false, order: 2 },
    ],
    reminders: [
      { id: 'rem-t-1', offsetMinutes: 15, channel: 'both', triggered: false },
    ],
    createdAt: todayStr,
    updatedAt: todayStr,
  },
  // 3. Today: Afternoon Meeting
  {
    id: 'task-today-2',
    userId: 'user-default',
    title: 'Design critique & user flow walk-through with team',
    description: 'Review natural language task creation prompt, missed-task rescheduling modal, and calendar drag-drop.',
    dueDate: todayStr,
    startTime: '14:30',
    endTime: '15:30',
    priority: 'high',
    status: 'not_started',
    categoryId: 'cat-work',
    projectId: 'proj-dayora',
    tags: ['team', 'critique', 'sprint'],
    estimatedMinutes: 60,
    subtasks: [
      { id: 'sub-t21', taskId: 'task-today-2', title: 'Open Figma prototype & Dayora sandbox', completed: false, order: 0 },
      { id: 'sub-t22', taskId: 'task-today-2', title: 'Record feedback into actionable subtasks', completed: false, order: 1 },
    ],
    reminders: [
      { id: 'rem-t-2', offsetMinutes: 10, channel: 'both', triggered: false },
    ],
    createdAt: todayStr,
    updatedAt: todayStr,
  },
  // 4. Today: Completed Morning Task
  {
    id: 'task-today-3',
    userId: 'user-default',
    title: 'Morning 20-minute breathwork & green tea ritual',
    description: 'Set mindful intentions for the day and journal 3 gratitude affirmations.',
    dueDate: todayStr,
    startTime: '07:30',
    endTime: '08:00',
    priority: 'medium',
    status: 'completed',
    categoryId: 'cat-wellness',
    tags: ['mindfulness', 'morning', 'gratitude'],
    estimatedMinutes: 30,
    actualMinutes: 25,
    completedAt: todayStr + 'T07:55:00',
    subtasks: [
      { id: 'sub-t31', taskId: 'task-today-3', title: 'Box breathing (4-4-4-4) 10 cycles', completed: true, order: 0 },
      { id: 'sub-t32', taskId: 'task-today-3', title: 'Journal top 3 core focus targets', completed: true, order: 1 },
    ],
    reminders: [],
    createdAt: todayStr,
    updatedAt: todayStr,
  },
  // 5. Today: Evening Task
  {
    id: 'task-today-4',
    userId: 'user-default',
    title: 'Read 2 chapters of "Designing Data-Intensive Applications"',
    description: 'Focus on consensus algorithms, replication logs, and event-driven architecture.',
    dueDate: todayStr,
    startTime: '20:00',
    endTime: '21:00',
    priority: 'low',
    status: 'not_started',
    categoryId: 'cat-learning',
    projectId: 'proj-reading',
    tags: ['reading', 'systems', 'growth'],
    estimatedMinutes: 60,
    subtasks: [],
    reminders: [
      { id: 'rem-t-4', offsetMinutes: 15, channel: 'in_app', triggered: false },
    ],
    createdAt: todayStr,
    updatedAt: todayStr,
  },
  // 6. Tomorrow: Upcoming Task
  {
    id: 'task-tomorrow-1',
    userId: 'user-default',
    title: 'Audit browser push notification Web API permissions & audio chimes',
    description: 'Test quiet hours suppression window and escalation rules for missed items.',
    dueDate: tomorrowStr,
    startTime: '11:00',
    endTime: '12:00',
    priority: 'urgent',
    status: 'not_started',
    categoryId: 'cat-work',
    projectId: 'proj-dayora',
    tags: ['notifications', 'audio', 'reliability'],
    estimatedMinutes: 60,
    subtasks: [],
    reminders: [
      { id: 'rem-tm-1', offsetMinutes: 30, channel: 'both', triggered: false },
    ],
    createdAt: todayStr,
    updatedAt: todayStr,
  },
  // 7. In Two Days: Upcoming
  {
    id: 'task-upcoming-2',
    userId: 'user-default',
    title: 'Monthly investment portfolio rebalance & savings transfer',
    description: 'Allocate monthly surplus across diversified index funds and rainy day treasury reserve.',
    dueDate: inTwoDaysStr,
    startTime: '15:00',
    endTime: '16:00',
    priority: 'medium',
    status: 'not_started',
    categoryId: 'cat-finance',
    tags: ['finance', 'wealth', 'routine'],
    estimatedMinutes: 45,
    subtasks: [],
    reminders: [
      { id: 'rem-up-2', offsetMinutes: 60, channel: 'both', triggered: false },
    ],
    recurrence: {
      frequency: 'monthly',
      interval: 1,
    },
    createdAt: todayStr,
    updatedAt: todayStr,
  },
];

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    userId: 'user-default',
    title: 'Morning Breathwork & Mindfulness',
    description: '15 minutes of grounding meditation before touching any screens.',
    category: 'Personal & Wellness',
    frequency: 'daily',
    color: '#8B9E87',
    icon: 'Sparkles',
    reminderTime: '07:15',
    createdAt: subDays(today, 30).toISOString(),
  },
  {
    id: 'habit-2',
    userId: 'user-default',
    title: 'Drink 2.5 Liters of Pure Water',
    description: 'Keep hydrated throughout deep work sessions to sustain cognitive energy.',
    category: 'Health & Fitness',
    frequency: 'daily',
    color: '#4F8F99',
    icon: 'Droplets',
    reminderTime: '11:00',
    createdAt: subDays(today, 30).toISOString(),
  },
  {
    id: 'habit-3',
    userId: 'user-default',
    title: '30-Minute Focused Reading',
    description: 'Expand mental models through philosophy, software engineering, or history.',
    category: 'Deep Learning',
    frequency: 'daily',
    color: '#B59445',
    icon: 'BookOpen',
    reminderTime: '20:30',
    createdAt: subDays(today, 30).toISOString(),
  },
  {
    id: 'habit-4',
    userId: 'user-default',
    title: 'Cardio / Strength Training',
    description: 'Maintain cardiovascular health and physical stamina.',
    category: 'Health & Fitness',
    frequency: 'weekly',
    targetDaysPerWeek: 5,
    color: '#529871',
    icon: 'Activity',
    reminderTime: '17:30',
    createdAt: subDays(today, 30).toISOString(),
  },
  {
    id: 'habit-5',
    userId: 'user-default',
    title: 'Daily Evening Digital Sunset',
    description: 'Disconnect from all email and notifications by 9:30 PM for deep sleep.',
    category: 'Personal & Wellness',
    frequency: 'daily',
    color: '#6F5977',
    icon: 'Moon',
    reminderTime: '21:30',
    createdAt: subDays(today, 30).toISOString(),
  },
];

// Generate realistic habit completion logs for the past 21 days
export const INITIAL_HABIT_LOGS: HabitLog[] = [];
['habit-1', 'habit-2', 'habit-3', 'habit-4', 'habit-5'].forEach((hId, hIndex) => {
  for (let i = 21; i >= 0; i--) {
    const dStr = format(subDays(today, i), 'yyyy-MM-dd');
    // High completion rate with realistic realistic occasional off-days
    const isCompleted = (i + hIndex) % 7 !== 0 || i === 0;
    INITIAL_HABIT_LOGS.push({
      id: `log-${hId}-${dStr}`,
      habitId: hId,
      date: dStr,
      completed: isCompleted,
    });
  }
});

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-missed-1',
    userId: 'user-default',
    type: 'overdue',
    title: 'Unfinished Task Requires Attention',
    message: 'Your task "Review Q3 operational budget allocation" missed its scheduled deadline. Would you like to reschedule or mark it complete?',
    taskId: 'task-overdue-1',
    read: false,
    urgent: true,
    createdAt: yesterdayStr + 'T17:05:00',
  },
  {
    id: 'notif-today-1',
    userId: 'user-default',
    type: 'summary_morning',
    title: 'Good Morning, Elena! ☀️',
    message: 'You have 4 tasks scheduled for today, including 1 urgent priority item. Make time for what matters!',
    read: false,
    createdAt: todayStr + 'T07:00:00',
  },
  {
    id: 'notif-today-2',
    userId: 'user-default',
    type: 'reminder',
    title: 'Upcoming: Design Critique in 2 hours',
    message: 'Your team review meeting starts at 2:30 PM.',
    taskId: 'task-today-2',
    read: true,
    createdAt: todayStr + 'T12:30:00',
  },
];

export const INITIAL_FOCUS_SESSIONS: FocusSession[] = [
  {
    id: 'f-1',
    userId: 'user-default',
    taskId: 'task-today-1',
    taskTitle: 'Complete Dayora theme customization preview engine',
    durationMinutes: 25,
    type: 'pomodoro',
    ambientSound: 'rain',
    completed: true,
    completedAt: todayStr + 'T10:45:00',
    notes: 'High flow state, finished color extraction logic.',
  },
  {
    id: 'f-2',
    userId: 'user-default',
    durationMinutes: 50,
    type: 'deep_work',
    ambientSound: 'forest',
    completed: true,
    completedAt: yesterdayStr + 'T14:50:00',
    notes: 'Drafted architecture doc for smart overdue engine.',
  },
];
