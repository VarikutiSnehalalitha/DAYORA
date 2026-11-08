'use client';

import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, AlertTriangle, Clock, 
  Calendar, TrendingUp, Target, Plus, Flame, 
  ArrowUpRight, ArrowRight, ShieldCheck, Zap, MoreHorizontal,
  ChevronRight, Trophy, Compass
} from 'lucide-react';
import { useDayora } from '@/hooks/useDayora';
import { TaskCard } from '@/components/TaskCard';
import { format } from 'date-fns';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area 
} from 'recharts';

interface DashboardViewProps {
  onOpenQuickAdd: () => void;
  onOpenMissedTasks: () => void;
  onSelectTaskTab: () => void;
  onSelectHabitTab: () => void;
  onOpenFocusMode: () => void;
}

export function DashboardView({
  onOpenQuickAdd,
  onOpenMissedTasks,
  onSelectTaskTab,
  onSelectHabitTab,
  onOpenFocusMode,
}: DashboardViewProps) {
  const { 
    preferences, tasksToday, tasksOverdue, tasksCompleted, 
    tasksUpcoming, tasksPending, habits, habitLogs, 
    categories, projects, productivityScore, toggleHabitDay 
  } = useDayora();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'urgent'>('all');
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  // Greeting based on current hour
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Weekly productivity chart sample data
  const weeklyData = [
    { day: 'Mon', completed: 5, target: 6 },
    { day: 'Tue', completed: 7, target: 6 },
    { day: 'Wed', completed: 6, target: 7 },
    { day: 'Thu', completed: 8, target: 7 },
    { day: 'Fri', completed: 6, target: 6 },
    { day: 'Sat', completed: 4, target: 4 },
    { day: 'Sun', completed: tasksCompleted.length, target: 5 },
  ];

  // Filter today's tasks
  const filteredTodayTasks = tasksToday.filter(t => {
    if (activeFilter === 'pending') return t.status !== 'completed';
    if (activeFilter === 'urgent') return t.priority === 'urgent' || t.priority === 'high';
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* 1. Hero Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-theme-glow/30 via-theme-sidebar to-theme-card border border-theme-border p-6 sm:p-8 shadow-subtle">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-theme-primary bg-theme-glow/50 px-2.5 py-1 rounded-full border border-theme-primary/20">
                Daily Focus Space
              </span>
              <span className="text-xs text-theme-text-muted">
                {format(new Date(), 'EEEE, MMMM d')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-theme-text-primary tracking-tight">
              {greeting}, {preferences.name.split(' ')[0]}
            </h1>
            <p className="text-xs sm:text-sm text-theme-text-secondary max-w-lg leading-relaxed">
              "Make Time for What Matters." You have <strong className="text-theme-primary">{tasksToday.length} tasks</strong> scheduled today and your productivity momentum is at <strong className="text-theme-primary">{productivityScore}%</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenFocusMode}
              className="px-4 py-2.5 rounded-xl border border-theme-primary/40 bg-theme-card hover:bg-theme-glow/40 text-theme-primary font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-subtle"
            >
              <Zap className="w-4 h-4 text-theme-primary" />
              <span>Start Focus Timer</span>
            </button>

            <button
              onClick={onOpenQuickAdd}
              className="px-4 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-subtle hover:shadow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow orb */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-theme-primary/10 blur-3xl pointer-events-none" />
      </div>

      {/* 2. Missed Tasks Attention Banner (if any) */}
      {tasksOverdue.length > 0 && (
        <div className="p-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-100">
                {tasksOverdue.length} Missed Task{tasksOverdue.length > 1 ? 's' : ''} Require Attention
              </h3>
              <p className="text-xs text-amber-800/80 dark:text-amber-200/80">
                You have unfinished deadlines from earlier. Reschedule them to keep your plan clean.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenMissedTasks}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-subtle flex items-center justify-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <span>Resolve Missed Tasks</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Productivity Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Due Today */}
        <div className="p-4 sm:p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-theme-text-muted">Today's Tasks</span>
            <div className="p-2 rounded-xl bg-theme-sidebar text-theme-primary">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-serif text-theme-text-primary">
              {tasksToday.length}
            </span>
            <span className="text-xs text-theme-text-secondary">
              ({tasksToday.filter(t => t.status === 'completed').length} done)
            </span>
          </div>
        </div>

        {/* Pending & Overdue */}
        <div className="p-4 sm:p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-theme-text-muted">Overdue</span>
            <div className={`p-2 rounded-xl ${tasksOverdue.length > 0 ? 'bg-amber-500/15 text-amber-600' : 'bg-theme-sidebar text-theme-text-muted'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-bold font-serif ${tasksOverdue.length > 0 ? 'text-amber-600' : 'text-theme-text-primary'}`}>
              {tasksOverdue.length}
            </span>
            <span className="text-xs text-theme-text-secondary">
              missed items
            </span>
          </div>
        </div>

        {/* Completed */}
        <div className="p-4 sm:p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-theme-text-muted">Completed</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-serif text-emerald-600 dark:text-emerald-400">
              {tasksCompleted.length}
            </span>
            <span className="text-xs text-theme-text-secondary">
              all-time
            </span>
          </div>
        </div>

        {/* Productivity Score Ring */}
        <div className="p-4 sm:p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-theme-text-muted">Dayora Score</span>
            <div className="p-2 rounded-xl bg-theme-glow text-theme-primary">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-bold font-serif text-theme-primary">
                {productivityScore}%
              </span>
              <span className="text-[10px] text-theme-text-muted uppercase font-bold tracking-wider">
                Index
              </span>
            </div>
            {/* Visual Mini Progress Bar */}
            <div className="w-16 h-2 rounded-full bg-theme-sidebar overflow-hidden">
              <div 
                className="h-full bg-theme-primary rounded-full transition-all duration-500" 
                style={{ width: `${productivityScore}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Grid: Left Task Schedule & Right Analytics / Habit Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Today's Schedule & Task List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-theme-text-primary">
                Today's Schedule & Focus
              </h2>
              <p className="text-xs text-theme-text-muted">
                Prioritized tasks scheduled for today
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-theme-sidebar border border-theme-border text-xs">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${activeFilter === 'all' ? 'bg-theme-card text-theme-primary shadow-subtle' : 'text-theme-text-secondary'}`}
              >
                All ({tasksToday.length})
              </button>
              <button
                onClick={() => setActiveFilter('pending')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${activeFilter === 'pending' ? 'bg-theme-card text-theme-primary shadow-subtle' : 'text-theme-text-secondary'}`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveFilter('urgent')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${activeFilter === 'urgent' ? 'bg-theme-card text-theme-primary shadow-subtle' : 'text-theme-text-secondary'}`}
              >
                Urgent / High
              </button>
            </div>
          </div>

          {/* Task Card List */}
          <div className="space-y-2.5">
            {filteredTodayTasks.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border border-dashed border-theme-border bg-theme-card/50 space-y-3">
                <CheckCircle2 className="w-8 h-8 text-theme-primary/50 mx-auto" />
                <h4 className="text-xs sm:text-sm font-semibold text-theme-text-primary">
                  No tasks matching filter
                </h4>
                <p className="text-xs text-theme-text-muted max-w-xs mx-auto">
                  Add a new task with natural language or enjoy some quiet reflection.
                </p>
                <button
                  onClick={onOpenQuickAdd}
                  className="px-3.5 py-1.5 rounded-xl bg-theme-primary text-white text-xs font-semibold hover:bg-theme-primary-hover shadow-subtle transition-all"
                >
                  + Add Today Task
                </button>
              </div>
            ) : (
              filteredTodayTasks.map(task => {
                const category = categories.find(c => c.id === task.categoryId);
                const project = projects.find(p => p.id === task.projectId);
                return (
                  <TaskCard
                    key={task.id}
                    task={task}
                    category={category}
                    project={project}
                  />
                );
              })
            )}
          </div>

          {/* Weekly Performance Bar Chart */}
          <div className="p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-theme-text-primary flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-theme-primary" />
                  Weekly Task Momentum
                </h3>
                <p className="text-[11px] text-theme-text-muted">Completed vs scheduled targets</p>
              </div>
              <span className="text-[11px] font-semibold text-theme-primary bg-theme-glow px-2 py-0.5 rounded-full">
                This Week
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
                  <Bar dataKey="completed" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Completed" />
                  <Bar dataKey="target" fill="var(--color-border)" radius={[4, 4, 0, 0]} name="Goal" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Daily Habits & High Priority Items */}
        <div className="space-y-5">
          {/* Daily Habit Consistency Widget */}
          <div className="p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-theme-text-primary flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  Habit Streaks
                </h3>
                <p className="text-[11px] text-theme-text-muted">Today's active routines</p>
              </div>
              <button
                onClick={onSelectHabitTab}
                className="text-[11px] font-semibold text-theme-primary hover:underline flex items-center gap-0.5"
              >
                <span>View All</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {habits.slice(0, 4).map(habit => {
                const isDoneToday = habitLogs.some(
                  l => l.habitId === habit.id && l.date === todayStr && l.completed
                );
                return (
                  <div
                    key={habit.id}
                    onClick={() => toggleHabitDay(habit.id, todayStr)}
                    className="p-2.5 rounded-xl border border-theme-border/80 bg-theme-sidebar/40 hover:bg-theme-sidebar flex items-center justify-between cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`
                        w-6 h-6 rounded-lg border flex items-center justify-center transition-all
                        ${isDoneToday ? 'bg-theme-primary border-theme-primary text-white shadow-sm' : 'border-theme-border group-hover:border-theme-primary'}
                      `}>
                        {isDoneToday && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className={`text-xs font-semibold ${isDoneToday ? 'line-through text-theme-text-muted' : 'text-theme-text-primary'}`}>
                          {habit.title}
                        </h4>
                        <span className="text-[10px] text-theme-text-muted">
                          {habit.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      <Flame className="w-3 h-3 fill-amber-500" />
                      <span>7d</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Projects Quick Glance */}
          <div className="p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-theme-text-primary">
                  Active Projects
                </h3>
                <p className="text-[11px] text-theme-text-muted">Milestones on track</p>
              </div>
            </div>

            <div className="space-y-3">
              {projects.map(proj => {
                const totalM = proj.milestones.length || 1;
                const doneM = proj.milestones.filter(m => m.completed).length;
                const progressPct = Math.round((doneM / totalM) * 100);

                return (
                  <div key={proj.id} className="space-y-1.5 p-2.5 rounded-xl bg-theme-sidebar/30 border border-theme-border/60">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-theme-text-primary truncate max-w-[170px]">
                        {proj.title}
                      </span>
                      <span className="font-bold text-theme-primary">
                        {progressPct}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-theme-border/60 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%`, backgroundColor: proj.color || 'var(--color-primary)' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mindful Productivity Insight */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-theme-glow/30 to-theme-card border border-theme-border space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-theme-primary">
              <Compass className="w-4 h-4" />
              <span>Dayora Daily Reflection</span>
            </div>
            <p className="text-xs text-theme-text-secondary leading-relaxed">
              "Focus is not about doing everything; it is about protecting the few things that create the deepest significance."
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
