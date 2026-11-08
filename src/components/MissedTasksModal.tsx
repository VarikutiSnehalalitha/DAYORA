'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, CheckCircle2, Clock, Calendar, 
  X, RefreshCw, ArrowRight, Sparkles, ChevronRight, Ban
} from 'lucide-react';
import { useDayora } from '@/hooks/useDayora';
import { Task } from '@/types';
import { format, addHours, addDays, nextSaturday } from 'date-fns';
import { fireTaskCompletionConfetti } from '@/lib/confetti';

interface MissedTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MissedTasksModal({ isOpen, onClose }: MissedTasksModalProps) {
  const { tasksOverdue, toggleTask, rescheduleTask, snoozeTask, updateTask } = useDayora();
  const [activeRescheduleId, setActiveRescheduleId] = useState<string | null>(null);
  const [customDate, setCustomDate] = useState<string>(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [customTime, setCustomTime] = useState<string>('09:00');

  if (!isOpen) return null;

  const handleComplete = (task: Task) => {
    toggleTask(task.id);
    fireTaskCompletionConfetti();
  };

  const handleReschedulePreset = (taskId: string, targetDate: string, targetTime?: string) => {
    rescheduleTask(taskId, targetDate, targetTime);
    setActiveRescheduleId(null);
  };

  const handleCancelTask = (taskId: string) => {
    updateTask(taskId, { status: 'cancelled' });
  };

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const tomorrowStr = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const weekendStr = format(nextSaturday(new Date()), 'yyyy-MM-dd');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-floating overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-theme-border bg-amber-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-theme-text-primary">
                Missed Task Resolution ({tasksOverdue.length})
              </h2>
              <p className="text-xs text-theme-text-secondary">
                Life happens. Make time to complete, reschedule, or mindfully close unfinished responsibilities.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-sidebar transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {tasksOverdue.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-theme-text-primary">No Missed Tasks!</h3>
              <p className="text-xs text-theme-text-muted max-w-sm mx-auto">
                All your scheduled responsibilities are on track or completed. Enjoy your mindful momentum!
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-theme-primary text-white text-xs font-semibold hover:bg-theme-primary-hover shadow-subtle transition-all"
              >
                Return to Workspace
              </button>
            </div>
          ) : (
            tasksOverdue.map(task => {
              const isRescheduling = activeRescheduleId === task.id;

              return (
                <div
                  key={task.id}
                  className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200">
                          Overdue Deadline: {task.dueDate} {task.startTime && `at ${task.startTime}`}
                        </span>
                        {task.priority === 'urgent' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300">
                            Urgent
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-theme-text-primary">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-xs text-theme-text-secondary line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleComplete(task)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-subtle transition-all whitespace-nowrap active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </button>
                  </div>

                  {/* Rescheduling picker or action row */}
                  {isRescheduling ? (
                    <div className="pt-2 border-t border-theme-border/60 space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-theme-text-primary">
                          Select New Schedule:
                        </span>
                        <button
                          onClick={() => setActiveRescheduleId(null)}
                          className="text-[11px] text-theme-text-muted hover:underline"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <button
                          onClick={() => handleReschedulePreset(task.id, todayStr, '17:00')}
                          className="px-3 py-2 rounded-lg border border-theme-border hover:border-theme-primary bg-theme-card text-xs font-medium text-theme-text-secondary hover:text-theme-primary text-left transition-all"
                        >
                          <div className="font-semibold">Today Evening</div>
                          <div className="text-[10px] text-theme-text-muted">5:00 PM</div>
                        </button>

                        <button
                          onClick={() => handleReschedulePreset(task.id, tomorrowStr, '09:00')}
                          className="px-3 py-2 rounded-lg border border-theme-border hover:border-theme-primary bg-theme-card text-xs font-medium text-theme-text-secondary hover:text-theme-primary text-left transition-all"
                        >
                          <div className="font-semibold">Tomorrow Morning</div>
                          <div className="text-[10px] text-theme-text-muted">9:00 AM</div>
                        </button>

                        <button
                          onClick={() => handleReschedulePreset(task.id, weekendStr, '10:00')}
                          className="px-3 py-2 rounded-lg border border-theme-border hover:border-theme-primary bg-theme-card text-xs font-medium text-theme-text-secondary hover:text-theme-primary text-left transition-all"
                        >
                          <div className="font-semibold">This Weekend</div>
                          <div className="text-[10px] text-theme-text-muted">Saturday 10 AM</div>
                        </button>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="date"
                          value={customDate}
                          onChange={e => setCustomDate(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 rounded-lg border border-theme-border bg-theme-card text-xs text-theme-text-primary"
                        />
                        <input
                          type="time"
                          value={customTime}
                          onChange={e => setCustomTime(e.target.value)}
                          className="w-28 px-2.5 py-1.5 rounded-lg border border-theme-border bg-theme-card text-xs text-theme-text-primary"
                        />
                        <button
                          onClick={() => handleReschedulePreset(task.id, customDate, customTime)}
                          className="px-3 py-1.5 rounded-lg bg-theme-primary text-white text-xs font-semibold hover:bg-theme-primary-hover shadow-subtle transition-all"
                        >
                          Set
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-theme-border/60 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveRescheduleId(task.id)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-theme-border bg-theme-card hover:border-theme-primary hover:text-theme-primary text-xs font-medium text-theme-text-secondary transition-all"
                        >
                          <Calendar className="w-3.5 h-3.5 text-theme-primary" />
                          <span>Reschedule</span>
                        </button>

                        <button
                          onClick={() => snoozeTask(task.id, 60)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-theme-border bg-theme-card hover:bg-theme-sidebar text-xs font-medium text-theme-text-muted hover:text-theme-text-primary transition-all"
                          title="Snooze for 1 hour"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Snooze 1h</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleCancelTask(task.id)}
                        className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 hover:underline px-2 py-1"
                      >
                        <Ban className="w-3 h-3" />
                        <span>Cancel Task</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-theme-border bg-theme-sidebar/50 flex items-center justify-between">
          <span className="text-[11px] text-theme-text-muted">
            Missed task escalation rules check every 15 mins during active hours.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-theme-border hover:bg-theme-card text-xs font-medium text-theme-text-primary transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
