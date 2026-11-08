'use client';

import React, { useState } from 'react';
import { 
  Target, Flame, Plus, CheckCircle2, Trophy, 
  Calendar, Sparkles, TrendingUp, X, Bell, Trash2, Droplets, BookOpen, Activity, Moon
} from 'lucide-react';
import { useDayora } from '@/hooks/useDayora';
import { Habit, HabitFrequency } from '@/types';
import { format, subDays, eachDayOfInterval } from 'date-fns';

export function HabitsView() {
  const { habits, habitLogs, toggleHabitDay, createHabit, deleteHabit } = useDayora();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Habit form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal & Wellness');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [color, setColor] = useState('#529871');
  const [reminderTime, setReminderTime] = useState('08:00');

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  // Last 14 days interval for the completion matrix
  const matrixDays = eachDayOfInterval({
    start: subDays(today, 13),
    end: today,
  });

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createHabit({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      frequency,
      color,
      icon: 'Sparkles',
      reminderTime,
    });

    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  // Calculate overall consistency percentage
  const totalLogs = habitLogs.length;
  const completedLogs = habitLogs.filter(l => l.completed).length;
  const overallRate = totalLogs > 0 ? Math.round((completedLogs / totalLogs) * 100) : 88;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-theme-text-primary tracking-tight">
            Habit Tracker & Mindful Routines
          </h1>
          <p className="text-xs text-theme-text-secondary">
            Build sustainable daily habits, protect continuous streaks, and celebrate progress.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs sm:text-sm font-semibold shadow-subtle flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Habit Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-theme-card border border-theme-border shadow-subtle flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
            <Flame className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <div className="text-xl font-bold font-serif text-theme-text-primary">
              14 Days
            </div>
            <div className="text-[11px] text-theme-text-muted">Current Best Streak</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-theme-card border border-theme-border shadow-subtle flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-theme-glow text-theme-primary flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-serif text-theme-text-primary">
              {overallRate}%
            </div>
            <div className="text-[11px] text-theme-text-muted">30-Day Consistency</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-theme-card border border-theme-border shadow-subtle flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-serif text-emerald-600">
              {habits.length} Active
            </div>
            <div className="text-[11px] text-theme-text-muted">Target Disciplines</div>
          </div>
        </div>
      </div>

      {/* Interactive Habit Matrix Grid */}
      <div className="p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-theme-text-primary">
              14-Day Consistency Matrix
            </h3>
            <p className="text-[11px] text-theme-text-muted">
              Click any square to toggle completion for that day
            </p>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="min-w-[680px] space-y-3">
            {/* Header dates row */}
            <div className="grid grid-cols-16 gap-1 text-center text-[10px] font-semibold text-theme-text-muted pb-2 border-b border-theme-border">
              <div className="col-span-4 text-left pl-2">Habit</div>
              <div className="col-span-2 text-center">Streak</div>
              {matrixDays.map(day => (
                <div key={day.toISOString()} className={format(day, 'yyyy-MM-dd') === todayStr ? 'text-theme-primary font-bold' : ''}>
                  <div>{format(day, 'EE')[0]}</div>
                  <div>{format(day, 'd')}</div>
                </div>
              ))}
            </div>

            {/* Habit Rows */}
            {habits.map(habit => {
              // Calculate streak
              let streak = 0;
              for (let i = 0; i < 30; i++) {
                const checkD = format(subDays(today, i), 'yyyy-MM-dd');
                const isLogged = habitLogs.some(l => l.habitId === habit.id && l.date === checkD && l.completed);
                if (isLogged) streak++;
                else if (i > 0) break;
              }

              return (
                <div key={habit.id} className="grid grid-cols-16 gap-1 items-center py-2 px-2 rounded-xl hover:bg-theme-sidebar/40 transition-colors">
                  {/* Title & Category */}
                  <div className="col-span-4 min-w-0 pr-2">
                    <div className="text-xs font-semibold text-theme-text-primary truncate">
                      {habit.title}
                    </div>
                    <div className="text-[10px] text-theme-text-muted truncate">
                      {habit.category}
                    </div>
                  </div>

                  {/* Streak */}
                  <div className="col-span-2 flex items-center justify-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                    <Flame className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{streak}d</span>
                  </div>

                  {/* 14 Day Completion Cells */}
                  {matrixDays.map(day => {
                    const dayStr = format(day, 'yyyy-MM-dd');
                    const isDone = habitLogs.some(l => l.habitId === habit.id && l.date === dayStr && l.completed);
                    const isCurrent = dayStr === todayStr;

                    return (
                      <div key={dayStr} className="flex items-center justify-center">
                        <button
                          onClick={() => toggleHabitDay(habit.id, dayStr)}
                          className={`
                            w-6 h-6 rounded-lg border transition-all flex items-center justify-center
                            ${isDone 
                              ? 'bg-theme-primary border-theme-primary text-white shadow-xs' 
                              : isCurrent 
                                ? 'border-theme-primary/50 bg-theme-glow/30 hover:border-theme-primary' 
                                : 'border-theme-border/60 bg-theme-sidebar/40 hover:border-theme-border'
                            }
                          `}
                          title={`${habit.title} on ${dayStr}: ${isDone ? 'Completed' : 'Missed'}`}
                        >
                          {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Habit Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-lg p-5 shadow-floating space-y-4">
            <div className="flex items-center justify-between border-b border-theme-border pb-3">
              <h3 className="text-sm font-bold text-theme-text-primary">Create New Routine Habit</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-theme-text-muted hover:text-theme-text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-theme-text-secondary">Habit Name *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. 20-Minute Evening Reading"
                  className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-background text-theme-text-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-theme-text-secondary">Description / Intention</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Why this habit matters to your long-term vision..."
                  className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-background text-theme-text-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-theme-text-secondary">Frequency</label>
                  <select
                    value={frequency}
                    onChange={e => setFrequency(e.target.value as HabitFrequency)}
                    className="w-full px-3 py-1.5 rounded-xl border border-theme-border bg-theme-background text-theme-text-primary"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly (5x/week)</option>
                    <option value="monthly">Monthly Review</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-theme-text-secondary">Daily Reminder Time</label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={e => setReminderTime(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-theme-border bg-theme-background text-theme-text-primary"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-theme-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-theme-border hover:bg-theme-sidebar font-semibold text-theme-text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-theme-primary text-white font-semibold hover:bg-theme-primary-hover shadow-subtle"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
